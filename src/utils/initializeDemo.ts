
import { createAdminUser } from "./createAdminUser";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const initializeDemo = async () => {
  try {
    // Check if already logged in
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (sessionData.session) {
      // Already logged in
      const { data: userData } = await supabase.auth.getUser();
      
      if (userData.user) {
        // Check if user is admin
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userData.user.id)
          .single();
          
        if (profileData && profileData.role === 'admin') {
          toast({
            title: "Already Logged In",
            description: "You are already logged in as an admin user.",
          });
          
          // Redirect to admin page after successful login
          window.location.href = "/admin";
          return { success: true, message: "Already logged in as admin" };
        }
      }
    }
    
    // Create or login as demo admin user
    const result = await createAdminUser("admin@gmail.com", "123456");
    
    if (result.success) {
      toast({
        title: "Admin Access Granted",
        description: result.message,
      });
      
      // Redirect to admin page after successful login
      window.location.href = "/admin";
    } else {
      toast({
        title: "Failed to Access Admin Dashboard",
        description: result.message,
        variant: "destructive",
      });
    }
    
    return result;
  } catch (error) {
    console.error("Error in initializeDemo:", error);
    toast({
      title: "Error",
      description: "An unexpected error occurred while setting up the demo.",
      variant: "destructive",
    });
    return { success: false, message: "An unexpected error occurred" };
  }
};
