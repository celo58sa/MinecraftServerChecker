import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { useEffect, useRef } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Keep track of previous status for the Minecraft server checker
  const intervalRef = useRef<number | null>(null);

  // Add Minecraft font
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @font-face {
        font-family: 'Minecraft';
        src: url('https://cdn.jsdelivr.net/gh/South-Paw/typeface-minecraft@master/font/minecraftia-regular.woff2') format('woff2');
        font-weight: normal;
        font-style: normal;
      }
    `;
    document.head.appendChild(style);
    
    // Add title
    document.title = "Minecraft Bot Controller";
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Keep the server checker alive
  useEffect(() => {
    const keepServerAlive = () => {
      // Send a request to the server checker
      fetch("https://MinecraftServerChecker.oxygeva83.repl.co", { 
        method: "GET",
        mode: "no-cors" // CORS policy may block direct requests
      }).then(() => {
        console.log("Keeping Minecraft Server Checker alive...");
      }).catch(error => {
        console.log("Error pinging server checker:", error);
      });
    };

    // Ping immediately on load
    keepServerAlive();
    
    // Set up an interval to ping every 5 minutes
    intervalRef.current = window.setInterval(keepServerAlive, 5 * 60 * 1000);
    
    // Clean up interval when component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
