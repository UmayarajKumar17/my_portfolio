import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { initGA, trackPageView } from "@/utils/analytics";

// Use the specific Google Analytics tracking ID
const GA_TRACKING_ID = "G-MD5CG3N4WF";

const queryClient = new QueryClient();

// Analytics tracker component
const AnalyticsTracker = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  
  useEffect(() => {
    // Track page view whenever the location changes
    if (navigationType !== 'POP') {
      trackPageView(location.pathname + location.search);
    }
  }, [location, navigationType]);
  
  return null;
};

const App = () => {
  // Initialize Google Analytics
  useEffect(() => {
    initGA(GA_TRACKING_ID);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/my_portfolio">
          <AnalyticsTracker />
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
