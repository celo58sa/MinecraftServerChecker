import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add custom background to the body
document.body.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('https://images.unsplash.com/photo-1617296538902-887900d9b592?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=1080&q=80')";
document.body.style.backgroundSize = "cover";
document.body.style.backgroundPosition = "center";
document.body.style.backgroundAttachment = "fixed";

createRoot(document.getElementById("root")!).render(<App />);
