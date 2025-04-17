import { pgTable, text, serial, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  avatarUrl: text("avatar_url"),
});

// Transaction schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  merchant: text("merchant").notNull(),
  amount: real("amount").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  category: text("category").notNull(),
  description: text("description"),
});

// Financial account schema
export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  type: text("type").notNull(), // checking, savings, credit, investment
  balance: real("balance").notNull(),
  currency: text("currency").notNull().default("USD"),
  isActive: boolean("is_active").notNull().default(true),
});

// Budget schema
export const budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  category: text("category").notNull(),
  amount: real("amount").notNull(),
  period: text("period").notNull(), // monthly, annually
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
});

// Financial goals schema
export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  targetAmount: real("target_amount").notNull(),
  currentAmount: real("current_amount").notNull().default(0),
  deadline: timestamp("deadline"),
  isCompleted: boolean("is_completed").notNull().default(false),
});

// Voice commands history
export const voiceCommands = pgTable("voice_commands", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  command: text("command").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  wasSuccessful: boolean("was_successful").notNull().default(true),
  response: text("response"),
});

// Insert schemas using drizzle-zod
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true });
export const insertAccountSchema = createInsertSchema(accounts).omit({ id: true });
export const insertBudgetSchema = createInsertSchema(budgets).omit({ id: true });
export const insertGoalSchema = createInsertSchema(goals).omit({ id: true });
export const insertVoiceCommandSchema = createInsertSchema(voiceCommands).omit({ id: true });

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type Account = typeof accounts.$inferSelect;

export type InsertBudget = z.infer<typeof insertBudgetSchema>;
export type Budget = typeof budgets.$inferSelect;

export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goals.$inferSelect;

export type InsertVoiceCommand = z.infer<typeof insertVoiceCommandSchema>;
export type VoiceCommand = typeof voiceCommands.$inferSelect;
