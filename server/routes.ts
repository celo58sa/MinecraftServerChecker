import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WebSocketServer, WebSocket } from "ws";
import { connectionRequestSchema, commandRequestSchema, quickActionRequestSchema } from "@shared/schema";
import { createClient, Client } from "minecraft-protocol";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Set up WebSocket server for real-time communication on a specific path
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store the current Minecraft client
  let minecraftClient: Client | null = null;
  
  // No need to require WebSocket since we already imported it
  
  // Helper to send updates to all connected WebSocket clients
  const broadcastUpdate = (type: string, data: any) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type, data }));
      }
    });
  };

  // API endpoint to connect to a Minecraft server
  app.post("/api/connect", async (req, res) => {
    try {
      // Validate request
      const data = connectionRequestSchema.parse(req.body);
      
      // Disconnect any existing client
      if (minecraftClient && minecraftClient.socket && !minecraftClient.socket.destroyed) {
        minecraftClient.end("Disconnected by user");
        minecraftClient = null;
        
        // Update the active connection status
        const activeConnection = await storage.getActiveConnection();
        if (activeConnection) {
          await storage.updateConnectionStatus(activeConnection.id, false);
        }
        
        broadcastUpdate("bot_disconnected", { message: "Bot disconnected by user" });
      }
      
      // Save connection info
      const connection = await storage.saveConnection({
        serverIp: data.serverIp,
        serverPort: data.serverPort,
        minecraftVersion: data.minecraftVersion,
        botUsername: data.botUsername,
        isConnected: false
      });
      
      // Attempt to connect to the Minecraft server
      try {
        // Configure client with anti-bot bypass settings
        const clientOptions: any = {
          host: data.serverIp,
          port: data.serverPort,
          username: data.botUsername,
          version: data.minecraftVersion,
          auth: data.auth || 'offline',
          // Anti-bot bypass options
          skipValidation: data.bypassAntibot,
          hideErrors: false
        };
        
        // Add more anti-bot bypass settings
        if (data.bypassAntibot) {
          // Set client settings that make the bot appear more like a real player
          clientOptions.keepAlive = true;
          clientOptions.closeTimeout = 240; // Longer timeout to appear more like a real player
          clientOptions.validateStatus = false; // Skip some validations
          clientOptions.skipTimeout = true; // Skip login timeout
          clientOptions.viewDistance = 'far'; // Use player-like view distance
          clientOptions.chatLengthLimit = 256; // Standard chat limit for players
        }
        
        minecraftClient = createClient(clientOptions);
        
        // Setup listeners
        minecraftClient.on("connect", () => {
          broadcastUpdate("bot_connecting", { message: "Connecting to server..." });
        });
        
        minecraftClient.on("login", async () => {
          // Update connection status
          await storage.updateConnectionStatus(connection.id, true);
          
          // Send login success message
          broadcastUpdate("bot_connected", { 
            message: "Successfully connected to server!",
            connection: await storage.getConnectionById(connection.id)
          });
          
          // Anti-bot bypass actions: perform human-like behavior after login
          if (data.bypassAntibot) {
            try {
              // Wait a bit before taking actions (humans don't act instantly)
              setTimeout(() => {
                // Send a realistic chat message
                if (minecraftClient) {
                  minecraftClient.write("chat", { message: "Hi everyone!" });
                }
                
                // Look around like a player (simulating mouse movement)
                setTimeout(() => {
                  if (minecraftClient) {
                    minecraftClient.write("look", { yaw: 180, pitch: 0, onGround: true });
                  }
                  
                  // Move a bit like a player
                  setTimeout(() => {
                    // Move head
                    if (minecraftClient) {
                      minecraftClient.write("look", { yaw: 190, pitch: 10, onGround: true });
                    }
                    
                    // Jump after a delay (typical player behavior)
                    setTimeout(() => {
                      if (minecraftClient && (minecraftClient as any).entity) {
                        minecraftClient.write("entity_action", { 
                          entityId: (minecraftClient as any).entity.id, 
                          actionId: 1, // Jump action
                          jumpBoost: 0 
                        });
                      }
                    }, 2000); // 2 seconds delay
                  }, 1500); // 1.5 seconds delay
                }, 1000); // 1 second delay
              }, 3000); // 3 seconds after login
              
              broadcastUpdate("chat_message", { 
                message: "Anti-bot bypass: Performing human-like actions to avoid detection" 
              });
            } catch (error) {
              console.error("Error during anti-bot bypass actions:", error);
            }
          }
        });
        
        minecraftClient.on("chat", (packet) => {
          // Extract chat message from packet (different formats in different versions)
          let message = "Message received";
          
          if (packet.message) {
            message = typeof packet.message === 'string' 
              ? packet.message 
              : JSON.stringify(packet.message);
          }
          
          broadcastUpdate("chat_message", { message });
        });
        
        minecraftClient.on("error", (err) => {
          broadcastUpdate("bot_error", { message: err.message });
        });
        
        minecraftClient.on("end", async () => {
          // Update connection status
          await storage.updateConnectionStatus(connection.id, false);
          
          broadcastUpdate("bot_disconnected", { message: "Disconnected from server" });
          minecraftClient = null;
        });
        
        // Return immediate response
        return res.status(200).json({ 
          message: "Connection attempt started",
          connection
        });
        
      } catch (error: any) {
        // Handle connection error
        await storage.updateConnectionStatus(connection.id, false);
        
        return res.status(500).json({ 
          message: "Failed to connect to Minecraft server",
          error: error.message
        });
      }
      
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid connection request",
          error: fromZodError(error).message
        });
      }
      
      return res.status(500).json({ 
        message: "Server error",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // API endpoint to disconnect from Minecraft server
  app.post("/api/disconnect", async (req, res) => {
    if (minecraftClient && minecraftClient.socket && !minecraftClient.socket.destroyed) {
      minecraftClient.end("Disconnected by user");
      minecraftClient = null;
      
      // Update the active connection status
      const activeConnection = await storage.getActiveConnection();
      if (activeConnection) {
        await storage.updateConnectionStatus(activeConnection.id, false);
      }
      
      return res.status(200).json({ message: "Bot disconnected successfully" });
    }
    
    return res.status(400).json({ message: "Bot is not connected" });
  });
  
  // API endpoint to send chat message/command
  app.post("/api/command", async (req, res) => {
    try {
      const { command } = commandRequestSchema.parse(req.body);
      
      if (!minecraftClient || !minecraftClient.socket || minecraftClient.socket.destroyed) {
        return res.status(400).json({ message: "Bot is not connected" });
      }
      
      // Send command to server
      minecraftClient.write("chat", { message: command });
      
      return res.status(200).json({ message: "Command sent successfully" });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid command request",
          error: fromZodError(error).message
        });
      }
      
      return res.status(500).json({ 
        message: "Server error",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // API endpoint for quick actions
  app.post("/api/action", async (req, res) => {
    try {
      const { action } = quickActionRequestSchema.parse(req.body);
      
      if (!minecraftClient || !minecraftClient.socket || minecraftClient.socket.destroyed) {
        return res.status(400).json({ message: "Bot is not connected" });
      }
      
      // Execute the requested action
      switch (action) {
        case "jump":
          // Different versions have different implementations
          // This is simplified - in a full implementation we would need version-specific handling
          minecraftClient.write("entity_action", { 
            entityId: (minecraftClient as any).entity?.id || 0,
            actionId: 1, // Jump action
            jumpBoost: 0
          });
          break;
          
        case "look":
          minecraftClient.write("look", {
            yaw: 180,
            pitch: 0,
            onGround: true
          });
          break;
          
        case "chat":
          minecraftClient.write("chat", { message: "Hello, I am a bot!" });
          break;
          
        case "forward":
          // This is simplified and would need version-specific implementation
          minecraftClient.write("position", {
            x: 0,
            y: 0,
            z: 1, // Move forward in Z direction
            onGround: true
          });
          break;
      }
      
      return res.status(200).json({ message: `Action ${action} executed successfully` });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid action request",
          error: fromZodError(error).message
        });
      }
      
      return res.status(500).json({ 
        message: "Server error",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // API endpoint to get current connection status
  app.get("/api/status", async (req, res) => {
    try {
      const activeConnection = await storage.getActiveConnection();
      
      return res.status(200).json({
        isConnected: !!activeConnection?.isConnected,
        connection: activeConnection || null
      });
    } catch (error) {
      return res.status(500).json({ 
        message: "Server error",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  return httpServer;
}
