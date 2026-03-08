import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n"; // <-- Ajoutez cette ligne

createRoot(document.getElementById("root")!).render(<App />);