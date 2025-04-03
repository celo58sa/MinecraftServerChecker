import { ConnectionRequest, CommandRequest, QuickActionRequest } from "@shared/schema";

// Helper function for API requests
async function apiRequest(method: string, url: string, data?: unknown): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${text || res.statusText}`);
  }
  
  return res;
}

// Function to connect to a Minecraft server
export async function connectToServer(data: ConnectionRequest) {
  const response = await apiRequest("POST", "/api/connect", data);
  return response.json();
}

// Function to disconnect from a Minecraft server
export async function disconnectFromServer() {
  const response = await apiRequest("POST", "/api/disconnect");
  return response.json();
}

// Function to send a command to the bot
export async function sendBotCommand(data: CommandRequest) {
  const response = await apiRequest("POST", "/api/command", data);
  return response.json();
}

// Function to execute a quick action
export async function executeBotAction(data: QuickActionRequest) {
  const response = await apiRequest("POST", "/api/action", data);
  return response.json();
}

// Function to get the current connection status
export async function getConnectionStatus() {
  const response = await fetch("/api/status", {
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}
