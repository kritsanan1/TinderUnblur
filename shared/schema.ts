import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  tinderToken: text("tinder_token"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  autoSwipeEnabled: boolean("auto_swipe_enabled").default(false),
  dailyLimit: integer("daily_limit").default(50),
  swipeInterval: integer("swipe_interval").default(3),
  ageMin: integer("age_min").default(22),
  ageMax: integer("age_max").default(35),
  verifiedOnly: boolean("verified_only").default(false),
  photoQuality: boolean("photo_quality").default(false),
  bioRequired: boolean("bio_required").default(false),
});

export const analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: timestamp("date").defaultNow(),
  matches: integer("matches").default(0),
  profileViews: integer("profile_views").default(0),
  swipes: integer("swipes").default(0),
  matchRate: integer("match_rate").default(0), // stored as percentage * 100
  profileScore: integer("profile_score").default(0),
});

export const teasers = pgTable("teasers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  teaserData: jsonb("teaser_data"),
  isUnblurred: boolean("is_unblurred").default(false),
  unblurredAt: timestamp("unblurred_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'match', 'optimization', 'auto_swipe', 'unblur'
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  tinderToken: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  userId: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  date: true,
});

export const insertTeaserSchema = createInsertSchema(teasers).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;
export type InsertTeaser = z.infer<typeof insertTeaserSchema>;
export type Teaser = typeof teasers.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
