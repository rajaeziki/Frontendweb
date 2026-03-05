import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./component/ui/toaster";
import { TooltipProvider } from "./component/ui/tooltip";

import Home from "./pages/homee";
import Chat from "./pages/Chat";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Diagnosis from "./pages/diagnosis/index";  // <- Changé ici (pas de .tsx, juste le dossier)

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/chat" component={Chat} />
      <Route path="/diagnosis" component={Diagnosis} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;