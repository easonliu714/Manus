
/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ==================== User Profiles ====================
export const userProfiles = mysqlTable("user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  gender: mysqlEnum("gender", ["male", "female", "other"]),
  birthDate: timestamp("birthDate"),
  heightCm: int("heightCm"), // Height in cm
  currentWeightKg: int("currentWeightKg"), // Weight in kg * 10 (e.g., 70.5kg = 705)
  targetWeightKg: int("targetWeightKg"),
  activityLevel: mysqlEnum("activityLevel", [
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extra_active",
  ]).default("sedentary"),
  goal: mysqlEnum("goal", ["lose_weight", "maintain", "gain_weight"]).default("maintain"),
  dailyCalorieTarget: int("dailyCalorieTarget"),
  proteinPercentage: int("proteinPercentage").default(30),
  carbsPercentage: int("carbsPercentage").default(40),
  fatPercentage: int("fatPercentage").default(30),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ==================== Food Items ====================
export const foodItems = mysqlTable("food_items", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  brand: varchar("brand", { length: 255 }),
  barcode: varchar("barcode", { length: 128 }).unique(),
  servingSizeG: int("servingSizeG"), // Serving size in grams
  servingSizeDescription: varchar("servingSizeDescription", { length: 255 }),
  caloriesPerServing: int("caloriesPerServing"),
  proteinG: int("proteinG"), // * 10 (e.g., 5.5g = 55)
  carbsG: int("carbsG"), // * 10
  fatG: int("fatG"), // * 10
  fiberG: int("fiberG"), // * 10
  sugarG: int("sugarG"), // * 10
  sodiumMg: int("sodiumMg"),
  cholesterolMg: int("cholesterolMg"),
  vitaminAMcg: int("vitaminAMcg"),
  vitaminCMg: int("vitaminCMg"),
  calciumMg: int("calciumMg"),
  ironMg: int("ironMg"),
  imageUrl: text("imageUrl"),
  source: mysqlEnum("source", ["user", "barcode", "ai", "database"]).default("database"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ==================== Food Logs ====================
export const foodLogs = mysqlTable("food_logs", {