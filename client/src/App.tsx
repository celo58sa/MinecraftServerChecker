import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
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
  
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
