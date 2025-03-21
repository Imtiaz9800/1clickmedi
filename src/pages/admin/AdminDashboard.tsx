import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Users,
  Store,
  Microscope,
  Building2,
  MessageSquare,
  TrendingUp,
  UserCheck,
  CalendarDays,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Stats {
  doctors: number;
  medicalShops: number;
  labs: number;
  hospitals: number;
  contactMessages: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [stats, setStats] = useState<Stats>({
    doctors: 0,
    medicalShops: 0,
    labs: 0,
    hospitals: 0,
    contactMessages: 0,
  });
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
        fetchStats();
      } catch (error) {
        console.error("Error checking admin status:", error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const [
        doctorsData,
        shopsData,
        labsData,
        hospitalsData,
      ] = await Promise.all([
        supabase.from('doctors').select('count'),
        supabase.from('medical_shops').select('count'),
        supabase.from('pathology_labs').select('count'),
        supabase.from('hospitals').select('count')
      ]);

      // Set a default value for contact messages since the table might not exist yet
      const contactMessages = 0;

      setStats({
        doctors: doctorsData.count || 0,
        medicalShops: shopsData.count || 0,
        labs: labsData.count || 0,
        hospitals: hospitalsData.count || 0,
        contactMessages: contactMessages,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const dashboardCards = [
    {
      title: "Doctors",
      count: stats.doctors,
      description: "Total registered doctors",
      icon: <Users className="h-12 w-12 text-blue-600 dark:text-blue-400" />,
      link: "/admin/doctors",
      color: "bg-blue-50 dark:bg-blue-950",
      gradientFrom: "from-blue-600",
      gradientTo: "to-indigo-600",
    },
    {
      title: "Medical Shops",
      count: stats.medicalShops,
      description: "Total registered medical shops",
      icon: <Store className="h-12 w-12 text-green-600 dark:text-green-400" />,
      link: "/admin/medical-shops",
      color: "bg-green-50 dark:bg-green-950",
      gradientFrom: "from-green-600",
      gradientTo: "to-teal-600",
    },
    {
      title: "Laboratories",
      count: stats.labs,
      description: "Total registered labs",
      icon: <Microscope className="h-12 w-12 text-purple-600 dark:text-purple-400" />,
      link: "/admin/labs",
      color: "bg-purple-50 dark:bg-purple-950",
      gradientFrom: "from-purple-600",
      gradientTo: "to-pink-600",
    },
    {
      title: "Hospitals",
      count: stats.hospitals,
      description: "Total registered hospitals",
      icon: <Building2 className="h-12 w-12 text-red-600 dark:text-red-400" />,
      link: "/admin/hospitals",
      color: "bg-red-50 dark:bg-red-950",
      gradientFrom: "from-red-600",
      gradientTo: "to-orange-600",
    },
  ];

  const quickActions = [
    {
      title: "Add Doctor",
      icon: <UserCheck className="h-5 w-5" />,
      link: "/admin/doctors",
      color: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    {
      title: "Add Medical Shop",
      icon: <Store className="h-5 w-5" />,
      link: "/admin/medical-shops",
      color: "bg-green-600 hover:bg-green-700 text-white",
    },
    {
      title: "Add Lab",
      icon: <Microscope className="h-5 w-5" />,
      link: "/admin/labs",
      color: "bg-purple-600 hover:bg-purple-700 text-white",
    },
    {
      title: "Add Hospital",
      icon: <Building2 className="h-5 w-5" />,
      link: "/admin/hospitals",
      color: "bg-red-600 hover:bg-red-700 text-white",
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

        <div className="mb-8">
          <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link to={action.link} key={index}>
                <Button
                  className={`w-full justify-start gap-2 ${action.color}`}
                  onClick={() => navigate(action.link)}
                >
                  {action.icon}
                  <span className={isMobile ? "hidden" : "block"}>{action.title}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-4">
            Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={card.link}>
                  <Card className={`overflow-hidden hover:shadow-md transition-all duration-300 ${card.color} border border-gray-200 dark:border-gray-700`}>
                    <div className="absolute inset-0 opacity-5 bg-gradient-to-r from-transparent via-white to-transparent"></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl font-bold">
                            {card.title}
                          </CardTitle>
                          <CardDescription>
                            {card.description}
                          </CardDescription>
                        </div>
                        <div className="rounded-md p-2">
                          {card.icon}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{card.count}</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="text-xs inline-flex items-center font-medium">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        View Details
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-4">
            Recent Activity
          </h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Log</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                    <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <p className="font-medium">New doctor added</p>
                    <p className="text-gray-500 dark:text-gray-400">30 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                    <Store className="h-4 w-4 text-green-600 dark:text-green-300" />
                  </div>
                  <div>
                    <p className="font-medium">Medical shop updated</p>
                    <p className="text-gray-500 dark:text-gray-400">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full">
                    <CalendarDays className="h-4 w-4 text-red-600 dark:text-red-300" />
                  </div>
                  <div>
                    <p className="font-medium">3 New contact messages</p>
                    <p className="text-gray-500 dark:text-gray-400">Yesterday</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminDashboard;
