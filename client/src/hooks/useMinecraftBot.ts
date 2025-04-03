import { useState, useEffect, useCallback, useRef } from "react";
import { connectToServer, disconnectFromServer, sendBotCommand, executeBotAction, getConnectionStatus } from "@/lib/api";
import { ConnectionRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface BotMessage {
  type: "info" | "error" | "success" | "chat";
  content: string;
}

interface ConnectionInfo {
  serverIp: string;
  serverPort: number;
  minecraftVersion: string;
  botUsername: string;
  isConnected: boolean;
}

export function useMinecraftBot() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(null);
  const [botOutput, setBotOutput] = useState<BotMessage[]>([]);
  const ws = useRef<WebSocket | null>(null);
  const { toast } = useToast();
  
  // Function to add a message to the bot output
  const addBotMessage = useCallback((message: BotMessage) => {
    setBotOutput(prev => [...prev, message]);
  }, []);
  
  // Initialize WebSocket connection
  useEffect(() => {
    // Create WebSocket connection with the proper path
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);
    
    socket.addEventListener("open", () => {
      console.log("WebSocket connection established");
    });
    
    socket.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case "bot_connecting":
            addBotMessage({ type: "info", content: data.data.message });
            setIsConnecting(true);
            break;
            
          case "bot_connected":
            addBotMessage({ type: "success", content: data.data.message });
            setIsConnected(true);
            setIsConnecting(false);
            if (data.data.connection) {
              setConnectionInfo({
                serverIp: data.data.connection.serverIp,
                serverPort: data.data.connection.serverPort,
                minecraftVersion: data.data.connection.minecraftVersion,
                botUsername: data.data.connection.botUsername,
                isConnected: true
              });
            }
            break;
            
          case "bot_disconnected":
            addBotMessage({ type: "info", content: data.data.message });
            setIsConnected(false);
            setIsConnecting(false);
            if (connectionInfo) {
              setConnectionInfo({
                ...connectionInfo,
                isConnected: false
              });
            }
            break;
            
          case "bot_error":
            addBotMessage({ type: "error", content: data.data.message });
            setIsConnected(false);
            setIsConnecting(false);
            break;
            
          case "chat_message":
            addBotMessage({ type: "chat", content: data.data.message });
            break;
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });
    
    socket.addEventListener("close", () => {
      console.log("WebSocket connection closed");
    });
    
    socket.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
    });
    
    ws.current = socket;
    
    // Check initial connection status
    getConnectionStatus()
      .then(data => {
        if (data.isConnected && data.connection) {
          setIsConnected(true);
          setConnectionInfo({
            serverIp: data.connection.serverIp,
            serverPort: data.connection.serverPort,
            minecraftVersion: data.connection.minecraftVersion,
            botUsername: data.connection.botUsername,
            isConnected: true
          });
          addBotMessage({ type: "info", content: "Connection restored from previous session" });
        }
      })
      .catch(error => {
        console.error("Error fetching connection status:", error);
      });
    
    // Cleanup WebSocket on unmount
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [addBotMessage]);
  
  // Function to connect to a Minecraft server
  const connect = useCallback(async (connectionData: ConnectionRequest) => {
    if (isConnected || isConnecting) {
      toast({
        title: "Already connected",
        description: "The bot is already connected or connecting to a server",
        variant: "destructive"
      });
      return;
    }
    
    setIsConnecting(true);
    addBotMessage({ type: "info", content: "Attempting to connect..." });
    
    try {
      await connectToServer(connectionData);
      
      // The actual connection status will be updated through WebSocket
      
    } catch (error) {
      setIsConnecting(false);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      addBotMessage({ type: "error", content: `Connection failed: ${errorMessage}` });
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [isConnected, isConnecting, addBotMessage, toast]);
  
  // Function to disconnect from a Minecraft server
  const disconnect = useCallback(async () => {
    if (!isConnected) {
      toast({
        title: "Not connected",
        description: "The bot is not connected to any server",
        variant: "destructive"
      });
      return;
    }
    
    addBotMessage({ type: "info", content: "Disconnecting..." });
    
    try {
      await disconnectFromServer();
      
      // The actual disconnection status will be updated through WebSocket
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      addBotMessage({ type: "error", content: `Disconnection failed: ${errorMessage}` });
      toast({
        title: "Disconnection Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [isConnected, addBotMessage, toast]);
  
  // Function to send a command to the bot
  const sendCommand = useCallback(async (command: string) => {
    if (!isConnected) {
      toast({
        title: "Not connected",
        description: "The bot is not connected to any server",
        variant: "destructive"
      });
      return;
    }
    
    addBotMessage({ type: "info", content: `> ${command}` });
    
    try {
      await sendBotCommand({ command });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      addBotMessage({ type: "error", content: `Failed to send command: ${errorMessage}` });
      toast({
        title: "Command Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [isConnected, addBotMessage, toast]);
  
  // Function to execute a quick action
  const executeAction = useCallback(async (action: "jump" | "look" | "chat" | "forward") => {
    if (!isConnected) {
      toast({
        title: "Not connected",
        description: "The bot is not connected to any server",
        variant: "destructive"
      });
      return;
    }
    
    addBotMessage({ type: "info", content: `Executing action: ${action.toUpperCase()}` });
    
    try {
      await executeBotAction({ action });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      addBotMessage({ type: "error", content: `Failed to execute action: ${errorMessage}` });
      toast({
        title: "Action Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [isConnected, addBotMessage, toast]);
  
  // Function to clear the bot output
  const clearOutput = useCallback(() => {
    setBotOutput([]);
  }, []);
  
  return {
    isConnected,
    isConnecting,
    connectionInfo,
    botOutput,
    connect,
    disconnect,
    sendCommand,
    executeAction,
    clearOutput
  };
}
