import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BotControlsProps {
  isConnected: boolean;
  onSendCommand: (command: string) => void;
  onExecuteAction: (action: "jump" | "look" | "chat" | "forward") => void;
  botOutput: Array<{
    type: "info" | "error" | "success" | "chat";
    content: string;
  }>;
}

export function BotControls({
  isConnected,
  onSendCommand,
  onExecuteAction,
  botOutput,
}: BotControlsProps) {
  const [command, setCommand] = useState("");

  const handleSendCommand = () => {
    if (!command.trim()) return;
    onSendCommand(command);
    setCommand("");
  };

  const quickActions = [
    { id: "jump", label: "JUMP", icon: "arrow_upward" },
    { id: "look", label: "LOOK", icon: "visibility" },
    { id: "chat", label: "CHAT", icon: "chat" },
    { id: "forward", label: "MOVE", icon: "arrow_forward" },
  ] as const;

  return (
    <Card className="bg-[#1E1E1E] border-2 border-[#333333]">
      <CardHeader>
        <CardTitle className="font-['Minecraft',_monospace] text-xl pb-2 border-b border-[#333333]">Bot Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Command Interface */}
          <div className="space-y-2">
            <label htmlFor="commandInput" className="block text-sm font-medium">
              Command:
            </label>
            <div className="flex">
              <Input
                id="commandInput"
                className="bg-[#333333] rounded-l-md focus:ring-2 focus:ring-[#4CAF50]"
                placeholder="/help"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                disabled={!isConnected}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isConnected) {
                    handleSendCommand();
                  }
                }}
              />
              <Button
                type="button"
                className={`font-['Minecraft',_monospace] rounded-l-none ${
                  !isConnected
                    ? "bg-[#1E1E1E] text-[#666666] cursor-not-allowed"
                    : "bg-[#2196F3] hover:bg-[#1976d2]"
                }`}
                onClick={handleSendCommand}
                disabled={!isConnected}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </Button>
            </div>
            <p className="text-xs text-[#EEEEEE] opacity-70">
              Type a command for the bot to execute
            </p>
          </div>

          {/* Quick Actions Buttons */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Quick Actions:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  type="button"
                  className={`font-['Minecraft',_monospace] transition-all hover:translate-y-0 active:translate-y-0.5 text-sm ${
                    !isConnected
                      ? "bg-[#1E1E1E] text-[#666666] cursor-not-allowed"
                      : "bg-[#333333] hover:bg-[#444444]"
                  }`}
                  onClick={() => onExecuteAction(action.id)}
                  disabled={!isConnected}
                >
                  <ActionIcon icon={action.icon} className="mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Bot Output */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Bot Output:</h3>
            <ScrollArea className="h-40 bg-[#121212] p-4 rounded-md font-mono text-sm">
              {botOutput.length === 0 ? (
                <p className="text-[#FFC107] opacity-70">
                  Bot is not connected. Connect to a server to view output.
                </p>
              ) : (
                botOutput.map((output, index) => (
                  <p
                    key={index}
                    className={
                      output.type === "error"
                        ? "text-[#F44336]"
                        : output.type === "success"
                        ? "text-[#4CAF50]"
                        : output.type === "chat"
                        ? "text-[#2196F3]"
                        : "text-[#EEEEEE]"
                    }
                  >
                    {output.content}
                  </p>
                ))
              )}
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActionIcon({ icon, className = "" }: { icon: string; className?: string }) {
  switch (icon) {
    case "arrow_upward":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
      );
    case "visibility":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "chat":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
          <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
        </svg>
      );
    case "arrow_forward":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="m5 12 7 7 7-7" />
          <path d="M12 5v14" />
        </svg>
      );
    default:
      return null;
  }
}
