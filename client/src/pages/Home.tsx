import { ServerConnectionForm } from "@/components/ServerConnectionForm";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { BotControls } from "@/components/BotControls";
import { Footer } from "@/components/Footer";
import { useMinecraftBot } from "@/hooks/useMinecraftBot";

export default function Home() {
  const {
    isConnected,
    isConnecting,
    connectionInfo,
    botOutput,
    connect,
    disconnect,
    sendCommand,
    executeAction,
  } = useMinecraftBot();

  return (
    <div className="min-h-screen bg-[#121212] text-[#EEEEEE] bg-gradient-to-br from-[rgba(0,0,0,0.8)] to-[rgba(0,0,0,0.8)]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="font-['Minecraft',_monospace] text-4xl md:text-5xl text-[#4CAF50] mb-2 tracking-wider">
            MINECRAFT BOT
          </h1>
          <p className="text-sm md:text-base opacity-70">
            Connect a bot to your Minecraft server
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Server Connection Form */}
          <div className="md:col-span-2">
            <ServerConnectionForm
              onConnect={connect}
              onDisconnect={disconnect}
              isConnected={isConnected}
              isConnecting={isConnecting}
            />
          </div>

          {/* Connection Status */}
          <div className="h-full">
            <ConnectionStatus
              isConnected={isConnected}
              isConnecting={isConnecting}
              connectionInfo={connectionInfo}
              logs={botOutput}
            />
          </div>

          {/* Bot Controls */}
          <div className="md:col-span-3">
            <BotControls
              isConnected={isConnected}
              onSendCommand={sendCommand}
              onExecuteAction={executeAction}
              botOutput={botOutput}
            />
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
