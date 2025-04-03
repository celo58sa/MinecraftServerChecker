import { botConnections, type BotConnection, type InsertBotConnection } from "@shared/schema";

export interface IStorage {
  saveConnection(connection: InsertBotConnection): Promise<BotConnection>;
  getActiveConnection(): Promise<BotConnection | undefined>;
  updateConnectionStatus(id: number, isConnected: boolean): Promise<BotConnection | undefined>;
  getConnectionById(id: number): Promise<BotConnection | undefined>;
  getAllConnections(): Promise<BotConnection[]>;
  clearAllConnections(): Promise<void>;
}

export class MemStorage implements IStorage {
  private connections: Map<number, BotConnection>;
  private currentId: number;

  constructor() {
    this.connections = new Map();
    this.currentId = 1;
  }

  async saveConnection(connection: InsertBotConnection): Promise<BotConnection> {
    // Clear all existing connections when adding a new one
    // This is simpler than managing multiple connections for this application
    await this.clearAllConnections();
    
    const id = this.currentId++;
    const lastConnected = new Date().toISOString();
    const newConnection: BotConnection = { 
      ...connection, 
      id,
      lastConnected
    };
    
    this.connections.set(id, newConnection);
    return newConnection;
  }

  async getActiveConnection(): Promise<BotConnection | undefined> {
    const connections = Array.from(this.connections.values());
    return connections.find(conn => conn.isConnected);
  }

  async updateConnectionStatus(id: number, isConnected: boolean): Promise<BotConnection | undefined> {
    const connection = this.connections.get(id);
    if (!connection) return undefined;

    const updatedConnection: BotConnection = {
      ...connection,
      isConnected,
      lastConnected: isConnected ? new Date().toISOString() : connection.lastConnected
    };

    this.connections.set(id, updatedConnection);
    return updatedConnection;
  }

  async getConnectionById(id: number): Promise<BotConnection | undefined> {
    return this.connections.get(id);
  }

  async getAllConnections(): Promise<BotConnection[]> {
    return Array.from(this.connections.values());
  }

  async clearAllConnections(): Promise<void> {
    this.connections.clear();
  }
}

export const storage = new MemStorage();
