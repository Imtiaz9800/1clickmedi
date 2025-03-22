
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import ProfileSettings from "@/components/admin/settings/ProfileSettings";
import PreferencesSettings from "@/components/admin/settings/PreferencesSettings";

const AdminSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    email: "",
    name: "",
    phone: "",
  });
  const [darkModeEnabled, setDarkModeEnabled] = useState(
    localStorage.theme === "dark" || 
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    const loadUserProfile = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/admin/login");
          return;
        }

        // Fetch profile data
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("email, full_name, phone, role")
          .eq("id", session.user.id)
          .single();

        if (profileData) {
          setProfile({
            email: profileData.email || session.user.email || "",
            name: profileData.full_name || "",
            phone: profileData.phone || "",
          });
        } else if (error) {
          console.error("Error fetching profile:", error);
          toast({
            title: "Error",
            description: "Failed to load profile information",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [navigate]);

  return (
    <AdminLayout title="Settings">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-4xl"
      >
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-6">
            <ProfileSettings initialProfile={profile} />
          </TabsContent>
          
          <TabsContent value="preferences" className="mt-6">
            <PreferencesSettings 
              darkModeEnabled={darkModeEnabled} 
              onDarkModeChange={setDarkModeEnabled} 
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminSettings;
