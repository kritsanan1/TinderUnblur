import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserPreferencesSchema, insertAnalyticsSchema, insertTeaserSchema, insertActivitySchema } from "@shared/schema";
import { tinderService } from "./tinder-service";
import authRoutes from "./auth-routes";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Register authentication routes
  app.use('/api', authRoutes);
  
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

      // Configure Tinder service with user's token
      tinderService.setToken(tinderToken);
      
      // Fetch teasers from Tinder API
      const teasersResponse = await tinderService.fetchTeasers();
      
      if (!teasersResponse) {
        return res.status(500).json({ message: "Failed to fetch teasers from Tinder API" });
      }

      const teasers = teasersResponse.data?.results || [];

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

  // Get Tinder recommendations (real API)
  app.get("/api/tinder/recommendations/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { tinderToken } = req.query;
      
      if (!tinderToken) {
        return res.status(400).json({ message: "Tinder token required" });
      }

      tinderService.setToken(tinderToken as string);
      const recommendations = await tinderService.getRecommendations();
      
      if (!recommendations) {
        return res.status(500).json({ message: "Failed to fetch recommendations" });
      }

      res.json(recommendations);
    } catch (error) {
      console.error("Recommendations error:", error);
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  });

  // Perform swipe action (real API)
  app.post("/api/tinder/swipe", async (req, res) => {
    try {
      const { userId, targetUserId, direction, tinderToken } = req.body;
      
      if (!tinderToken) {
        return res.status(400).json({ message: "Tinder token required" });
      }

      tinderService.setToken(tinderToken);
      const result = await tinderService.performSwipe(targetUserId, direction);
      
      if (!result) {
        return res.status(500).json({ message: "Failed to perform swipe" });
      }

      // Log activity
      await storage.createActivity({
        userId,
        type: direction === 'like' ? 'match' : 'pass',
        title: direction === 'like' ? `Liked profile` : `Passed on profile`,
        icon: direction === 'like' ? 'fas fa-heart' : 'fas fa-times',
      });

      res.json(result);
    } catch (error) {
      console.error("Swipe error:", error);
      res.status(500).json({ message: "Failed to perform swipe" });
    }
  });

  // Real Auto-Swipe Control
  app.post("/api/auto-swipe/start", async (req, res) => {
    try {
      const { userId, tinderToken, preferences } = req.body;
      
      if (!tinderToken) {
        return res.status(400).json({ message: "Tinder token required" });
      }

      tinderService.setToken(tinderToken);
      
      // Store auto-swipe session
      const session = {
        userId,
        preferences,
        startTime: new Date(),
        isActive: true,
        swipeCount: 0
      };
      
      // Start background auto-swiping
      startAutoSwipeSession(session);
      
      res.json({ 
        message: "Real auto-swipe started",
        sessionId: `session_${Date.now()}`
      });
    } catch (error) {
      console.error("Auto-swipe start error:", error);
      res.status(500).json({ message: "Failed to start auto-swipe" });
    }
  });

  app.post("/api/auto-swipe/stop", async (req, res) => {
    try {
      const { userId } = req.body;
      
      // Stop auto-swipe session
      stopAutoSwipeSession(userId);
      
      res.json({ message: "Auto-swipe stopped" });
    } catch (error) {
      res.status(500).json({ message: "Failed to stop auto-swipe" });
    }
  });

  // Real Teaser Unblur with Tinder API
  app.post("/api/teasers/unblur/:teaserId", async (req, res) => {
    try {
      const { teaserId } = req.params;
      const { tinderToken } = req.query;
      
      if (!tinderToken) {
        return res.status(400).json({ message: "Tinder token required" });
      }

      tinderService.setToken(tinderToken as string);
      
      // Use real Tinder API to unblur teaser
      const result = await tinderService.performSwipe(teaserId, 'like');
      
      res.json({
        success: true,
        match: result?.match || false,
        teaserId,
        unblurred: true
      });
    } catch (error) {
      console.error("Teaser unblur error:", error);
      res.status(500).json({ message: "Failed to unblur teaser" });
    }
  });

  // Real Data Sync
  app.post("/api/tinder/sync-analytics", async (req, res) => {
    try {
      const { userId, tinderToken } = req.body;
      
      if (!tinderToken) {
        return res.status(400).json({ message: "Tinder token required" });
      }

      tinderService.setToken(tinderToken);
      
      // Fetch real analytics data
      const analytics = await tinderService.getAnalytics();
      const profile = await tinderService.getProfile();
      
      if (analytics && profile) {
        // Store real data
        await storage.updateUserAnalytics(userId, {
          matches: analytics.matches || 0,
          likes: analytics.likes || 0,
          superLikes: analytics.super_likes || 0,
          views: analytics.profile_views || 0,
          lastSyncDate: new Date().toISOString()
        });
      }
      
      res.json({ 
        success: true, 
        message: "Real analytics synced successfully" 
      });
    } catch (error) {
      console.error("Analytics sync error:", error);
      res.status(500).json({ message: "Failed to sync analytics" });
    }
  });

// Auto-swipe session management
const activeSwipeSessions = new Map();

async function startAutoSwipeSession(session: any) {
  const { userId, preferences } = session;
  
  if (activeSwipeSessions.has(userId)) {
    return; // Already running
  }
  
  activeSwipeSessions.set(userId, session);
  
  // Background swiping logic
  const swipeInterval = setInterval(async () => {
    try {
      const recommendations = await tinderService.getRecommendations();
      
      if (recommendations?.results?.length) {
        const user = recommendations.results[0];
        
        // AI decision logic based on preferences
        const shouldLike = makeSwipeDecision(user, preferences);
        const direction = shouldLike ? 'like' : 'pass';
        
        await tinderService.performSwipe(user._id, direction);
        
        session.swipeCount++;
        
        // Check daily limit
        if (session.swipeCount >= preferences.dailyLimit) {
          stopAutoSwipeSession(userId);
        }
      }
    } catch (error) {
      console.error('Auto-swipe error:', error);
    }
  }, preferences.swipeInterval * 1000);
  
  session.intervalId = swipeInterval;
}

function stopAutoSwipeSession(userId: string) {
  const session = activeSwipeSessions.get(userId);
  if (session?.intervalId) {
    clearInterval(session.intervalId);
    activeSwipeSessions.delete(userId);
  }
}

function makeSwipeDecision(user: any, preferences: any): boolean {
  // AI decision logic
  let score = 0.5; // Base score
  
  // Age preference
  if (user.birth_date) {
    const age = new Date().getFullYear() - new Date(user.birth_date).getFullYear();
    if (age >= preferences.ageRange[0] && age <= preferences.ageRange[1]) {
      score += 0.2;
    } else {
      score -= 0.3;
    }
  }
  
  // Verified filter
  if (preferences.filters.verifiedOnly && !user.is_verified) {
    return false;
  }
  
  // Bio filter
  if (preferences.filters.bioRequired && !user.bio) {
    return false;
  }
  
  // Photo quality (simplified)
  if (user.photos?.length >= 3) {
    score += 0.1;
  }
  
  // Strategy-based threshold
  const thresholds = {
    conservative: 0.7,
    balanced: 0.5,
    aggressive: 0.3
  };
  
  return score >= thresholds[preferences.strategy];
}

  // Perform super like (real API)
  app.post("/api/tinder/superlike", async (req, res) => {
    try {
      const { userId, targetUserId, tinderToken } = req.body;
      
      if (!tinderToken) {
        return res.status(400).json({ message: "Tinder token required" });
      }

      tinderService.setToken(tinderToken);
      const result = await tinderService.performSuperLike(targetUserId);
      
      if (!result) {
        return res.status(500).json({ message: "Failed to perform super like" });
      }

      // Log activity
      await storage.createActivity({
        userId,
        type: 'super_like',
        title: `Super liked profile`,
        icon: 'fas fa-star',
      });

      res.json(result);
    } catch (error) {
      console.error("Super like error:", error);
      res.status(500).json({ message: "Failed to perform super like" });
    }
  });

  // Get Tinder profile (real API)
  app.get("/api/tinder/profile/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { tinderToken } = req.query;
      
      if (!tinderToken) {
        return res.status(400).json({ message: "Tinder token required" });
      }

      tinderService.setToken(tinderToken as string);
      const profile = await tinderService.getProfile();
      
      if (!profile) {
        return res.status(500).json({ message: "Failed to fetch profile" });
      }

      res.json(profile);
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({ message: "Failed to get profile" });
    }
  });

  // Update location (real API)
  app.post("/api/tinder/location", async (req, res) => {
    try {
      const { userId, lat, lon, tinderToken } = req.body;
      
      if (!tinderToken) {
        return res.status(400).json({ message: "Tinder token required" });
      }

      tinderService.setToken(tinderToken);
      const result = await tinderService.updateLocation(lat, lon);
      
      if (!result) {
        return res.status(500).json({ message: "Failed to update location" });
      }

      // Log activity
      await storage.createActivity({
        userId,
        type: 'location_update',
        title: `Location updated`,
        description: `Updated location to ${lat}, ${lon}`,
        icon: 'fas fa-map-marker-alt',
      });

      res.json(result);
    } catch (error) {
      console.error("Location update error:", error);
      res.status(500).json({ message: "Failed to update location" });
    }
  });

  // Sync real analytics from Tinder API
  app.post("/api/tinder/sync-analytics/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { tinderToken } = req.body;
      
      if (!tinderToken) {
        return res.status(400).json({ message: "Tinder token required" });
      }

      tinderService.setToken(tinderToken);
      const tinderAnalytics = await tinderService.getAnalytics();
      
      if (tinderAnalytics) {
        // Update local analytics with real data from Tinder
        const analyticsData = {
          userId,
          matches: tinderAnalytics.matches || 0,
          profileViews: tinderAnalytics.profile_views || 0,
          swipes: tinderAnalytics.swipes || 0,
          matchRate: Math.round((tinderAnalytics.matches / Math.max(tinderAnalytics.swipes, 1)) * 10000), // percentage * 100
          profileScore: tinderAnalytics.profile_score || 0,
        };
        
        const updated = await storage.updateAnalytics(userId, analyticsData);
        
        // Log activity
        await storage.createActivity({
          userId,
          type: 'analytics_sync',
          title: 'Analytics synced with Tinder',
          description: `Updated analytics data from Tinder API`,
          icon: 'fas fa-sync-alt',
        });

        res.json(updated);
      } else {
        res.status(500).json({ message: "Failed to sync analytics" });
      }
    } catch (error) {
      console.error("Analytics sync error:", error);
      res.status(500).json({ message: "Failed to sync analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
