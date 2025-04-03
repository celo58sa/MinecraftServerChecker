import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define the server connection schema
export const botConnections = pgTable("bot_connections", {
  id: serial("id").primaryKey(),
  serverIp: text("server_ip").notNull(),
  serverPort: integer("server_port").notNull().default(25565),
  minecraftVersion: text("minecraft_version").notNull(),
  isConnected: boolean("is_connected").notNull().default(false),
  botUsername: text("bot_username").notNull().default("MCBot"),
  lastConnected: text("last_connected"),
});

export const botConnectionSchema = createInsertSchema(botConnections).pick({
  serverIp: true,
  serverPort: true,
  minecraftVersion: true,
  botUsername: true,
});

// Define schemas for requests
export const connectionRequestSchema = z.object({
  serverIp: z.string().min(1, "Server IP is required"),
  serverPort: z.number().int().min(1).max(65535).default(25565),
  minecraftVersion: z.string().min(1, "Minecraft version is required"),
  botUsername: z.string().default("MCBot"),
});

export const commandRequestSchema = z.object({
  command: z.string().min(1, "Command is required"),
});

export const quickActionRequestSchema = z.object({
  action: z.enum(["jump", "look", "chat", "forward"]),
});

// Define types for our schemas
export type BotConnection = typeof botConnections.$inferSelect;
export type InsertBotConnection = typeof botConnections.$inferInsert;
export type ConnectionRequest = z.infer<typeof connectionRequestSchema>;
export type CommandRequest = z.infer<typeof commandRequestSchema>;
export type QuickActionRequest = z.infer<typeof quickActionRequestSchema>;
