import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ResidentsPage from "./pages/residents";
import ResidentProfilePage from "./pages/resident-profile";
import NewResidentPage from "./pages/new-resident";
import NewIncidentPage from "./pages/new-incident";
import NewVitalsPage from "./pages/new-vitals";
import ClinicalVitalsPage from "./pages/clinical-vitals";
import TasksPage from "./pages/tasks";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/residents" element={<ResidentsPage />} />
          <Route path="/residents/new" element={<NewResidentPage />} />
          <Route path="/residents/:id" element={<ResidentProfilePage />} />
          <Route path="/incidents/new" element={<NewIncidentPage />} />
          <Route path="/clinical/vitals" element={<ClinicalVitalsPage />} />
          <Route path="/clinical/vitals/new" element={<NewVitalsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
