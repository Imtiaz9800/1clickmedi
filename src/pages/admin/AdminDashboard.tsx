import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Users, PlusCircle, Building, Store, Microscope, Stethoscope, Settings } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    doctors: 0,
    hospitals: 0,
    medicalShops: 0,
    pathologyLabs: 0,
  });

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsLoading(true);
        const { data: session } = await supabase.auth.getSession();
        
        if (!session.session) {
          navigate('/');
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
        await fetchStats();
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
      // Get counts from different tables
      const doctorsPromise = supabase.from('doctors').select('id', { count: 'exact', head: true });
      const hospitalsPromise = supabase.from('hospitals').select('id', { count: 'exact', head: true });
      const shopsPromise = supabase.from('medical_shops').select('id', { count: 'exact', head: true });
      const labsPromise = supabase.from('pathology_labs').select('id', { count: 'exact', head: true });

      const [doctorsResult, hospitalsResult, shopsResult, labsResult] = await Promise.all([
        doctorsPromise,
        hospitalsPromise,
        shopsPromise,
        labsPromise
      ]);

      setStats({
        doctors: doctorsResult.count || 0,
        hospitals: hospitalsResult.count || 0,
        medicalShops: shopsResult.count || 0,
        pathologyLabs: labsResult.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medical-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // This will be redirected by the useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to="/" className="text-xl font-semibold text-medical-800 dark:text-white flex items-center">
                <span className="bg-medical-600 text-white p-1 rounded-md mr-2">Doc</span>
                <span>Finder</span>
              </Link>
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-medical-100 text-medical-800 dark:bg-medical-900 dark:text-medical-100">
                Admin Dashboard
              </span>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm">
                Back to Site
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Manage doctors, hospitals, medical shops, and pathology labs
          </p>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-medium">Doctors</CardTitle>
                  <Stethoscope className="h-5 w-5 text-medical-600 dark:text-medical-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.doctors}</div>
                <CardDescription>Total registered doctors</CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-medium">Hospitals</CardTitle>
                  <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.hospitals}</div>
                <CardDescription>Total registered hospitals</CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-medium">Medical Shops</CardTitle>
                  <Store className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.medicalShops}</div>
                <CardDescription>Total registered shops</CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-medium">Labs</CardTitle>
                  <Microscope className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pathologyLabs}</div>
                <CardDescription>Total registered labs</CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs defaultValue="quick-actions" className="mt-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 bg-transparent">
              <TabsTrigger value="quick-actions" className="bg-white dark:bg-gray-800 data-[state=active]:bg-medical-100 dark:data-[state=active]:bg-medical-900 data-[state=active]:text-medical-800 dark:data-[state=active]:text-medical-100">
                Quick Actions
              </TabsTrigger>
              <TabsTrigger value="doctors" className="bg-white dark:bg-gray-800 data-[state=active]:bg-medical-100 dark:data-[state=active]:bg-medical-900 data-[state=active]:text-medical-800 dark:data-[state=active]:text-medical-100">
                Doctors
              </TabsTrigger>
              <TabsTrigger value="hospitals" className="bg-white dark:bg-gray-800 data-[state=active]:bg-medical-100 dark:data-[state=active]:bg-medical-900 data-[state=active]:text-medical-800 dark:data-[state=active]:text-medical-100">
                Hospitals
              </TabsTrigger>
              <TabsTrigger value="medical-shops" className="bg-white dark:bg-gray-800 data-[state=active]:bg-medical-100 dark:data-[state=active]:bg-medical-900 data-[state=active]:text-medical-800 dark:data-[state=active]:text-medical-100">
                Medical Shops
              </TabsTrigger>
              <TabsTrigger value="labs" className="bg-white dark:bg-gray-800 data-[state=active]:bg-medical-100 dark:data-[state=active]:bg-medical-900 data-[state=active]:text-medical-800 dark:data-[state=active]:text-medical-100">
                Pathology Labs
              </TabsTrigger>
            </TabsList>

            {/* Quick Actions Tab */}
            <TabsContent value="quick-actions" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-medical-600 dark:text-medical-400" />
                      <CardTitle className="text-lg">Add New Doctor</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Create a new doctor profile with specialties and contact information.
                    </p>
                    <Button 
                      onClick={() => navigate('/admin/doctors')}
                      className="w-full bg-medical-600 hover:bg-medical-700 text-white dark:bg-medical-500 dark:hover:bg-medical-600"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Doctor
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <CardTitle className="text-lg">Add Hospital</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Add a new hospital with facilities and specialty information.
                    </p>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Hospital
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <CardTitle className="text-lg">Site Settings</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Configure website settings, categories, and system preferences.
                    </p>
                    <Button 
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Site Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Doctors Tab */}
            <TabsContent value="doctors" className="mt-6">
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">Manage Doctors</CardTitle>
                    <Button 
                      onClick={() => navigate('/admin/doctors')}
                      className="bg-medical-600 hover:bg-medical-700 text-white dark:bg-medical-500 dark:hover:bg-medical-600"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add New Doctor
                    </Button>
                  </div>
                  <CardDescription>
                    Add, edit or remove doctor profiles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Separator className="my-4" />
                  <div className="text-center py-10">
                    <Button 
                      onClick={() => navigate('/admin/doctors')}
                      variant="outline" 
                      className="px-8"
                    >
                      Go to Doctor Management
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other tabs would go here */}
            <TabsContent value="hospitals" className="mt-6">
              <Card className="bg-white dark:bg-gray-800 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Hospital Management</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  This feature will be available soon. Check back later!
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="medical-shops" className="mt-6">
              <Card className="bg-white dark:bg-gray-800 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Medical Shop Management</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  This feature will be available soon. Check back later!
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="labs" className="mt-6">
              <Card className="bg-white dark:bg-gray-800 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Pathology Lab Management</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  This feature will be available soon. Check back later!
                </p>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
