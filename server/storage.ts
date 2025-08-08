import { 
  type User, 
  type InsertUser, 
  type UserPreferences, 
  type InsertUserPreferences,
  type Analytics,
  type InsertAnalytics,
  type Teaser,
  type InsertTeaser,
  type Activity,
  type InsertActivity
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserTinderToken(userId: string, token: string): Promise<User | undefined>;
  
  // User preferences methods
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  createUserPreferences(prefs: InsertUserPreferences & { userId: string }): Promise<UserPreferences>;
  updateUserPreferences(userId: string, prefs: Partial<InsertUserPreferences>): Promise<UserPreferences | undefined>;
  
  // Analytics methods
  getUserAnalytics(userId: string): Promise<Analytics[]>;
  getLatestAnalytics(userId: string): Promise<Analytics | undefined>;
  createAnalytics(analytics: InsertAnalytics & { userId: string }): Promise<Analytics>;
  
  // Teaser methods
  getUserTeasers(userId: string): Promise<Teaser[]>;
  createTeaser(teaser: InsertTeaser & { userId: string }): Promise<Teaser>;
  updateTeaserUnblurred(id: string): Promise<Teaser | undefined>;
  
  // Activity methods
  getUserActivities(userId: string, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity & { userId: string }): Promise<Activity>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private userPreferences: Map<string, UserPreferences>;
  private analytics: Map<string, Analytics>;
  private teasers: Map<string, Teaser>;
  private activities: Map<string, Activity>;

  constructor() {
    this.users = new Map();
    this.userPreferences = new Map();
    this.analytics = new Map();
    this.teasers = new Map();
    this.activities = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      tinderToken: insertUser.tinderToken || null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserTinderToken(userId: string, token: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, tinderToken: token };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    return Array.from(this.userPreferences.values()).find(
      (prefs) => prefs.userId === userId
    );
  }

  async createUserPreferences(prefs: InsertUserPreferences & { userId: string }): Promise<UserPreferences> {
    const id = randomUUID();
    const userPrefs: UserPreferences = { 
      ...prefs, 
      id,
      autoSwipeEnabled: prefs.autoSwipeEnabled || null,
      dailyLimit: prefs.dailyLimit || null,
      swipeInterval: prefs.swipeInterval || null,
      ageMin: prefs.ageMin || null,
      ageMax: prefs.ageMax || null,
      verifiedOnly: prefs.verifiedOnly || null,
      photoQuality: prefs.photoQuality || null,
      bioRequired: prefs.bioRequired || null
    };
    this.userPreferences.set(id, userPrefs);
    return userPrefs;
  }

  async updateUserPreferences(userId: string, prefs: Partial<InsertUserPreferences>): Promise<UserPreferences | undefined> {
    const existing = await this.getUserPreferences(userId);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...prefs };
    this.userPreferences.set(existing.id, updated);
    return updated;
  }

  async getUserAnalytics(userId: string): Promise<Analytics[]> {
    return Array.from(this.analytics.values())
      .filter((a) => a.userId === userId)
      .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));
  }

  async getLatestAnalytics(userId: string): Promise<Analytics | undefined> {
    const analytics = await this.getUserAnalytics(userId);
    return analytics[0];
  }

  async createAnalytics(analytics: InsertAnalytics & { userId: string }): Promise<Analytics> {
    const id = randomUUID();
    const analyticsData: Analytics = { 
      ...analytics, 
      id, 
      date: new Date(),
      matches: analytics.matches || null,
      profileViews: analytics.profileViews || null,
      swipes: analytics.swipes || null,
      matchRate: analytics.matchRate || null,
      profileScore: analytics.profileScore || null
    };
    this.analytics.set(id, analyticsData);
    return analyticsData;
  }

  async getUserTeasers(userId: string): Promise<Teaser[]> {
    return Array.from(this.teasers.values())
      .filter((t) => t.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createTeaser(teaser: InsertTeaser & { userId: string }): Promise<Teaser> {
    const id = randomUUID();
    const teaserData: Teaser = { 
      ...teaser, 
      id, 
      createdAt: new Date(),
      teaserData: teaser.teaserData || null,
      isUnblurred: teaser.isUnblurred || null,
      unblurredAt: teaser.unblurredAt || null
    };
    this.teasers.set(id, teaserData);
    return teaserData;
  }

  async updateTeaserUnblurred(id: string): Promise<Teaser | undefined> {
    const teaser = this.teasers.get(id);
    if (!teaser) return undefined;
    
    const updated = { 
      ...teaser, 
      isUnblurred: true, 
      unblurredAt: new Date() 
    };
    this.teasers.set(id, updated);
    return updated;
  }

  async getUserActivities(userId: string, limit = 20): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter((a) => a.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async createActivity(activity: InsertActivity & { userId: string }): Promise<Activity> {
    const id = randomUUID();
    const activityData: Activity = { 
      ...activity, 
      id, 
      createdAt: new Date(),
      icon: activity.icon || null,
      description: activity.description || null
    };
    this.activities.set(id, activityData);
    return activityData;
  }
}

export const storage = new MemStorage();
