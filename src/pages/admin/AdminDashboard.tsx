
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import { toast } from "@/components/ui/use-toast";
import {
  Users,
  Store,
  Microscope,
  Building2,
  UserCheck,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import StatsProvider from "@/components/admin/dashboard/StatsProvider";
import DashboardCard from "@/components/admin/dashboard/DashboardCard";
import QuickActions from "@/components/admin/dashboard/QuickActions";
import ActivityLog from "@/components/admin/dashboard/ActivityLog";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsLoading(true);
        const { data: session } = await supabase.auth.getSession();
        
        if (!session.session) {
          navigate('/admin/login');
          toast({
            title: "Access Denied",
            description: "You need to login to access the admin dashboard",
            variant: "destructive",
          });
          return;
        }

        // Check if user is admin
        const { data: user } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.session.user.id)
          .single();

        if (!user || user.role !== 'admin') {
          navigate('/');
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page",
            variant: "destructive",
          });
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error("Error checking admin status:", error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  const quickActions = [
    {
      title: "Add Doctor",
      icon: <UserCheck className="h-5 w-5" />,
      link: "/admin/doctors",
      color: "bg-blue-600 hover:bg-blue-700 text-white",
      isMobile: isMobile
    },
    {
      title: "Add Medical Shop",
      icon: <Store className="h-5 w-5" />,
      link: "/admin/medical-shops",
      color: "bg-green-600 hover:bg-green-700 text-white",
      isMobile: isMobile
    },
    {
      title: "Add Lab",
      icon: <Microscope className="h-5 w-5" />,
      link: "/admin/labs",
      color: "bg-purple-600 hover:bg-purple-700 text-white",
      isMobile: isMobile
    },
    {
      title: "Add Hospital",
      icon: <Building2 className="h-5 w-5" />,
      link: "/admin/hospitals",
      color: "bg-red-600 hover:bg-red-700 text-white",
      isMobile: isMobile
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout title="Admin Dashboard">
        <div className="flex items-center justify-center h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!isAdmin) {
    return null; // Will be redirected by useEffect
  }

  return (
    <AdminLayout title="Admin Dashboard">
      <StatsProvider>
        {(stats, statsLoading) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
                Welcome to Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Manage your healthcare provider network from one central location
              </p>
            </div>

            <QuickActions actions={quickActions} />

            <div className="mb-8">
              <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-4">
                Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statsLoading ? (
                  <div className="col-span-full flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <>
                    <DashboardCard
                      title="Doctors"
                      count={stats.doctors}
                      description="Total registered doctors"
                      icon={<Users className="h-12 w-12 text-blue-600 dark:text-blue-400" />}
                      link="/admin/doctors"
                      color="bg-blue-50 dark:bg-blue-950"
                      index={0}
                    />
                    <DashboardCard
                      title="Medical Shops"
                      count={stats.medicalShops}
                      description="Total registered medical shops"
                      icon={<Store className="h-12 w-12 text-green-600 dark:text-green-400" />}
                      link="/admin/medical-shops"
                      color="bg-green-50 dark:bg-green-950"
                      index={1}
                    />
                    <DashboardCard
                      title="Laboratories"
                      count={stats.labs}
                      description="Total registered labs"
                      icon={<Microscope className="h-12 w-12 text-purple-600 dark:text-purple-400" />}
                      link="/admin/labs"
                      color="bg-purple-50 dark:bg-purple-950"
                      index={2}
                    />
                    <DashboardCard
                      title="Hospitals"
                      count={stats.hospitals}
                      description="Total registered hospitals"
                      icon={<Building2 className="h-12 w-12 text-red-600 dark:text-red-400" />}
                      link="/admin/hospitals"
                      color="bg-red-50 dark:bg-red-950"
                      index={3}
                    />
                  </>
                )}
              </div>
            </div>

            <ActivityLog />
          </motion.div>
        )}
      </StatsProvider>
    </AdminLayout>
  );
};

export default AdminDashboard;
