import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const requests = pgTable("requests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  location: jsonb("location").notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").notNull().default("open"),
});

export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").notNull().references(() => requests.id),
  userId: integer("user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const locationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
});

export const insertRequestSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  location: locationSchema,
});

export const insertOfferSchema = createInsertSchema(offers).pick({
  requestId: true,
  message: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertRequest = z.infer<typeof insertRequestSchema>;
export type Request = {
  id: number;
  title: string;
  description: string;
  category: string;
  location: {
    lat: number;
    lng: number;
    neighborhood?: string;
    city?: string;
  };
  userId: number;
  status: string;
  createdAt: string | Date;
  user: User;
  distance: number;
};

export type InsertOffer = z.infer<typeof insertOfferSchema>;
export type Offer = {
  id: number;
  requestId: number;
  userId: number;
  message: string;
  status: string;
  createdAt: string | Date;
};
