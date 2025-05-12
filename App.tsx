import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import CursorEffect from "@/components/CursorEffect";
import { MirrorWorldProvider } from "@/contexts/MirrorWorldContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <CursorEffect />
      <Router />
    </TooltipProvider>
  );
}

export default App;
