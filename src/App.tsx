
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DoctorsPage from "./pages/DoctorsPage";
import MedicalShopsPage from "./pages/MedicalShopsPage";
import LabsPage from "./pages/LabsPage";
import HospitalsPage from "./pages/HospitalsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DoctorManagement from "./pages/admin/DoctorManagement";
import MedicalShopManagement from "./pages/admin/MedicalShopManagement";
import LabManagement from "./pages/admin/LabManagement";
import HospitalManagement from "./pages/admin/HospitalManagement";
import AdminLogin from "./pages/admin/AdminLogin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/doctors" element={<DoctorsPage />} />
              <Route path="/medical-shops" element={<MedicalShopsPage />} />
              <Route path="/labs" element={<LabsPage />} />
              <Route path="/hospitals" element={<HospitalsPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/doctors" element={<DoctorManagement />} />
              <Route path="/admin/medical-shops" element={<MedicalShopManagement />} />
              <Route path="/admin/labs" element={<LabManagement />} />
              <Route path="/admin/hospitals" element={<HospitalManagement />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
