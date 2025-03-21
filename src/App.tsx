
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import ContactManagement from "./pages/admin/ContactManagement";
import AdminLogin from "./pages/admin/AdminLogin";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

// AdminRoute component to protect admin routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (!session.session) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Check if user is admin
        const { data: user } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.session.user.id)
          .single();

        setIsAdmin(user?.role === 'admin');
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAdmin ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

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
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/doctors" 
                element={
                  <AdminRoute>
                    <DoctorManagement />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/medical-shops" 
                element={
                  <AdminRoute>
                    <MedicalShopManagement />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/labs" 
                element={
                  <AdminRoute>
                    <LabManagement />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/hospitals" 
                element={
                  <AdminRoute>
                    <HospitalManagement />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/contact" 
                element={
                  <AdminRoute>
                    <ContactManagement />
                  </AdminRoute>
                } 
              />
              
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
