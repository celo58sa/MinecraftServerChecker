import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface ServerConnectionFormProps {
  onConnect: (data: { 
    serverIp: string; 
    serverPort: number; 
    minecraftVersion: string; 
    botUsername: string;
    bypassAntibot: boolean;
  }) => void;
  onDisconnect: () => void;
  isConnected: boolean;
  isConnecting: boolean;
}

export function ServerConnectionForm({
  onConnect,
  onDisconnect,
  isConnected,
  isConnecting,
}: ServerConnectionFormProps) {
  const [serverIp, setServerIp] = useState("");
  const [serverPort, setServerPort] = useState("25565");
  const [minecraftVersion, setMinecraftVersion] = useState("");
  const [botUsername, setBotUsername] = useState("MinecraftBot");
  const [bypassAntibot, setBypassAntibot] = useState(true);
  const { toast } = useToast();

  const handleConnect = () => {
    if (!serverIp) {
      toast({
        title: "Server IP Required",
        description: "Please enter a server IP address",
        variant: "destructive",
      });
      return;
    }

    if (!minecraftVersion) {
      toast({
        title: "Version Required",
        description: "Please select a Minecraft version",
        variant: "destructive",
      });
      return;
    }

    if (!botUsername || botUsername.trim() === "") {
      toast({
        title: "Username Required",
        description: "Please enter a username for the bot",
        variant: "destructive",
      });
      return;
    }

    onConnect({
      serverIp,
      serverPort: parseInt(serverPort, 10),
      minecraftVersion,
      botUsername,
      bypassAntibot,
    });
  };

  // Supported Minecraft versions
  const minecraftVersions = [
    "1.20.4",
    "1.20.2",
    "1.19.4",
    "1.19.2",
    "1.18.2",
    "1.17.1",
    "1.16.5",
    "1.15.2",
    "1.14.4",
    "1.12.2",
    "1.8.9",
  ];

  return (
    <Card className="bg-[#1E1E1E] border-2 border-[#333333]">
      <CardHeader>
        <CardTitle className="font-['Minecraft',_monospace] text-xl pb-2 border-b border-[#333333]">Server Connection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="serverIp">Server IP Address</Label>
            <div className="flex">
              <div className="flex items-center px-3 bg-[#333333] rounded-l-md border border-r-0 border-[#333333]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-server">
                  <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
                  <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
                  <line x1="6" x2="6" y1="6" y2="6" />
                  <line x1="6" x2="6" y1="18" y2="18" />
                </svg>
              </div>
              <Input
                id="serverIp"
                className="bg-[#333333] rounded-r-md focus:ring-2 focus:ring-[#4CAF50]"
                placeholder="play.example.com"
                value={serverIp}
                onChange={(e) => setServerIp(e.target.value)}
                disabled={isConnected || isConnecting}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="serverPort">Port (Optional)</Label>
            <div className="flex">
              <div className="flex items-center px-3 bg-[#333333] rounded-l-md border border-r-0 border-[#333333]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <Input
                id="serverPort"
                type="number"
                className="bg-[#333333] rounded-r-md focus:ring-2 focus:ring-[#4CAF50]"
                placeholder="25565"
                value={serverPort}
                onChange={(e) => setServerPort(e.target.value)}
                disabled={isConnected || isConnecting}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="minecraftVersion">Minecraft Version</Label>
            <div className="flex">
              <div className="flex items-center px-3 bg-[#333333] rounded-l-md border border-r-0 border-[#333333]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-tag">
                  <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                  <path d="M7 7h.01" />
                </svg>
              </div>
              <Select
                value={minecraftVersion}
                onValueChange={setMinecraftVersion}
                disabled={isConnected || isConnecting}
              >
                <SelectTrigger className="bg-[#333333] rounded-r-md focus:ring-2 focus:ring-[#4CAF50] w-full">
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent>
                  {minecraftVersions.map((version) => (
                    <SelectItem key={version} value={version}>
                      {version}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="botUsername">Bot Username</Label>
            <div className="flex">
              <div className="flex items-center px-3 bg-[#333333] rounded-l-md border border-r-0 border-[#333333]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <Input
                id="botUsername"
                className="bg-[#333333] rounded-r-md focus:ring-2 focus:ring-[#4CAF50]"
                placeholder="MinecraftBot"
                value={botUsername}
                onChange={(e) => setBotUsername(e.target.value)}
                disabled={isConnected || isConnecting}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="bypass-antibot" 
              checked={bypassAntibot}
              onCheckedChange={setBypassAntibot}
              disabled={isConnected || isConnecting}
              className="data-[state=checked]:bg-[#4CAF50]"
            />
            <Label htmlFor="bypass-antibot" className="cursor-pointer">
              Bypass Anti-Bot Protection
            </Label>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              className={`font-['Minecraft',_monospace] transition-all hover:translate-y-0 active:translate-y-0.5 ${
                isConnected || isConnecting
                  ? "bg-[#1E1E1E] text-[#666666] cursor-not-allowed"
                  : "bg-[#4CAF50] hover:bg-[#3d8b40]"
              }`}
              onClick={handleConnect}
              disabled={isConnected || isConnecting}
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
                className="mr-2"
              >
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                <line x1="12" x2="12" y1="2" y2="12" />
              </svg>
              {isConnecting ? "CONNECTING..." : "CONNECT"}
            </Button>
            <Button
              type="button"
              className={`font-['Minecraft',_monospace] transition-all hover:translate-y-0 active:translate-y-0.5 ${
                !isConnected
                  ? "bg-[#1E1E1E] text-[#666666] cursor-not-allowed"
                  : "bg-[#F44336] hover:bg-[#d32f2f]"
              }`}
              onClick={onDisconnect}
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
                className="mr-2"
              >
                <path d="M18.36 6.64A9 9 0 0 1 20.77 15" />
                <path d="M6.16 6.16a9 9 0 1 0 12.68 12.68" />
                <path d="M12 2v4" />
                <path d="m2 2 20 20" />
              </svg>
              DISCONNECT
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
