import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserPreferencesSchema, insertAnalyticsSchema, insertTeaserSchema, insertActivitySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get user preferences
  app.get("/api/preferences/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const preferences = await storage.getUserPreferences(userId);
      
      if (!preferences) {
        // Create default preferences if none exist
        const defaultPrefs = {
          userId,
          autoSwipeEnabled: false,
          dailyLimit: 50,
          swipeInterval: 3,
          ageMin: 22,
          ageMax: 35,
          verifiedOnly: false,
          photoQuality: false,
          bioRequired: false,
        };
        const created = await storage.createUserPreferences(defaultPrefs);
        return res.json(created);
      }
      
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user preferences" });
    }
  });

  // Update user preferences
  app.patch("/api/preferences/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const updateData = insertUserPreferencesSchema.parse(req.body);
      
      const updated = await storage.updateUserPreferences(userId, updateData);
      if (!updated) {
        return res.status(404).json({ message: "User preferences not found" });
      }
      
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid preference data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update user preferences" });
    }
  });

  // Get user analytics
  app.get("/api/analytics/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const analytics = await storage.getLatestAnalytics(userId);
      
      if (!analytics) {
        // Create default analytics if none exist
        const defaultAnalytics = {
          userId,
          matches: 1247,
          profileViews: 8932,
          swipes: 5067,
          matchRate: 2460, // 24.60%
          profileScore: 92,
        };
        const created = await storage.createAnalytics(defaultAnalytics);
        return res.json(created);
      }
      
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user analytics" });
    }
  });

  // Update analytics
  app.post("/api/analytics", async (req, res) => {
    try {
      const analyticsData = insertAnalyticsSchema.parse(req.body);
      const created = await storage.createAnalytics(analyticsData);
      res.json(created);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid analytics data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create analytics" });
    }
  });

  // Get user teasers
  app.get("/api/teasers/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const teasers = await storage.getUserTeasers(userId);
      res.json(teasers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get teasers" });
    }
  });

  // Unblur teasers (fetch from Tinder API)
  app.post("/api/teasers/unblur", async (req, res) => {
    try {
      const { userId, tinderToken } = req.body;
      
      if (!tinderToken) {
        return res.status(400).json({ message: "Tinder token required" });
      }

      // Fetch teasers from Tinder API
      const response = await fetch("https://api.gotinder.com/v2/fast-match/teasers", {
        headers: {
          "X-Auth-Token": tinderToken,
          "platform": "android",
        },
      });

      if (!response.ok) {
        return res.status(response.status).json({ message: "Failed to fetch teasers from Tinder API" });
      }

      const data = await response.json();
      const teasers = data.data?.results || [];

      // Store teasers in database
      const storedTeasers = [];
      for (const teaser of teasers) {
        const stored = await storage.createTeaser({
          userId,
          teaserData: teaser,
          isUnblurred: true,
        });
        storedTeasers.push(stored);
      }

      // Create activity log
      await storage.createActivity({
        userId,
        type: "unblur",
        title: `${teasers.length} teasers unblurred successfully`,
        icon: "fas fa-magic",
      });

      res.json({ teasers: storedTeasers, count: teasers.length });
    } catch (error) {
      console.error("Unblur error:", error);
      res.status(500).json({ message: "Failed to unblur teasers" });
    }
  });

  // Mark teaser as unblurred
  app.patch("/api/teasers/:id/unblur", async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await storage.updateTeaserUnblurred(id);
      
      if (!updated) {
        return res.status(404).json({ message: "Teaser not found" });
      }
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update teaser" });
    }
  });

  // Get user activities
  app.get("/api/activities/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const activities = await storage.getUserActivities(userId, limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to get activities" });
    }
  });

  // Create activity
  app.post("/api/activities", async (req, res) => {
    try {
      const activityData = insertActivitySchema.parse(req.body);
      const created = await storage.createActivity(activityData);
      res.json(created);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid activity data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create activity" });
    }
  });

  // Update user's Tinder token
  app.patch("/api/users/:userId/tinder-token", async (req, res) => {
    try {
      const { userId } = req.params;
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }
      
      const updated = await storage.updateUserTinderToken(userId, token);
      if (!updated) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ message: "Token updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update token" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
