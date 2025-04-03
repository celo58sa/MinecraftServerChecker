import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
  connectionInfo: {
    serverIp: string;
    serverPort: number;
    minecraftVersion: string;
    botUsername: string;
    bypassAntibot?: boolean;
  } | null;
  logs: Array<{
    type: "info" | "error" | "success" | "chat";
    content: string;
  }>;
}

export function ConnectionStatus({
  isConnected,
  isConnecting,
  connectionInfo,
  logs,
}: ConnectionStatusProps) {
  return (
    <Card className="bg-[#1E1E1E] border-2 border-[#333333] flex flex-col h-full">
      <CardHeader>
        <CardTitle className="font-['Minecraft',_monospace] text-xl pb-2 border-b border-[#333333]">Status</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="mb-4 flex items-center">
          <div
            className={`w-3 h-3 rounded-full mr-2 ${
              isConnecting
                ? "bg-[#FFC107]"
                : isConnected
                ? "bg-[#4CAF50]"
                : "bg-[#F44336]"
            }`}
          />
          <span className="text-sm">
            {isConnecting ? "Connecting..." : isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <span className="text-xs text-[#EEEEEE] opacity-70">Connection Info:</span>
            <div className="bg-[#121212] p-3 rounded-md text-xs font-mono mt-1">
              <div>
                IP:{" "}
                <span className="text-[#4CAF50]">
                  {connectionInfo ? `${connectionInfo.serverIp}:${connectionInfo.serverPort}` : "Not connected"}
                </span>
              </div>
              <div>
                Version:{" "}
                <span className="text-[#4CAF50]">
                  {connectionInfo ? connectionInfo.minecraftVersion : "Not connected"}
                </span>
              </div>
              <div>
                Ping: <span className="text-[#4CAF50]">--</span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-xs text-[#EEEEEE] opacity-70">Bot Info:</span>
            <div className="bg-[#121212] p-3 rounded-md text-xs font-mono mt-1">
              <div>
                Username:{" "}
                <span className="text-[#4CAF50]">
                  {connectionInfo ? connectionInfo.botUsername : "MCBot"}
                </span>
              </div>
              <div>
                Health: <span className="text-[#4CAF50]">--</span>
              </div>
              <div>
                Position: <span className="text-[#4CAF50]">--</span>
              </div>
              <div>
                Anti-Bot:{" "}
                <span className={connectionInfo?.bypassAntibot ? "text-[#4CAF50]" : "text-[#F44336]"}>
                  {connectionInfo?.bypassAntibot ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <span className="text-xs text-[#EEEEEE] opacity-70">Logs:</span>
          <ScrollArea className="h-24 bg-[#121212] p-3 rounded-md text-xs font-mono mt-1">
            {logs.length === 0 ? (
              <div className="text-[#FFC107] opacity-70">
                No logs available. Connect to a server to view logs.
              </div>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className={
                    log.type === "error"
                      ? "text-[#F44336]"
                      : log.type === "success"
                      ? "text-[#4CAF50]"
                      : log.type === "chat"
                      ? "text-[#2196F3]"
                      : "text-[#EEEEEE]"
                  }
                >
                  {log.content}
                </div>
              ))
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
