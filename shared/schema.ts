import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User interview responses schema
export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  questionIndex: integer("question_index").notNull(),
  responseText: text("response_text").notNull(),
  emotionData: jsonb("emotion_data"),
  createdAt: text("created_at").notNull(),
});

// Mirror profiles schema
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  entityName: text("entity_name").notNull(),
  strengths: jsonb("strengths").notNull(),
  unrealizedPotential: text("unrealized_potential").notNull(),
  poeticSummary: text("poetic_summary").notNull(),
  shadowEcho: text("shadow_echo").notNull(),
  createdAt: text("created_at").notNull(),
});

// Insert schemas
export const insertResponseSchema = createInsertSchema(responses).pick({
  sessionId: true,
  questionIndex: true,
  responseText: true,
  emotionData: true,
  createdAt: true,
});

export const insertProfileSchema = createInsertSchema(profiles).pick({
  sessionId: true,
  entityName: true,
  strengths: true,
  unrealizedPotential: true,
  poeticSummary: true,
  shadowEcho: true,
  createdAt: true,
});

// Types
export type InsertResponse = z.infer<typeof insertResponseSchema>;
export type Response = typeof responses.$inferSelect;

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;

// Keep existing user schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
