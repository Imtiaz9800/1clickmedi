
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const createAdminUser = async (email: string, password: string) => {
  try {
    // First check if the user already exists
    const { data: existingUser, error: userCheckError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    
    if (userCheckError) {
      console.error('Error checking existing user:', userCheckError.message);
      return { success: false, message: userCheckError.message };
    }
    
    if (existingUser) {
      console.log('Admin user already exists');
      
      // Try to sign in the existing user
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) {
        console.error('Error signing in admin:', signInError.message);
        return { success: false, message: 'Login failed: ' + signInError.message };
      }
      
      if (!data.user) {
        return { success: false, message: 'Failed to login as admin user' };
      }
      
      toast({
        title: "Admin Login Successful",
        description: "Welcome back to the admin dashboard!",
      });
      
      return { success: true, message: 'Admin login successful', user: data.user };
    }

    // Create the user with Supabase Auth
    const { data: authUser, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      console.error('Error creating admin user:', signUpError.message);
      return { success: false, message: signUpError.message };
    }

    if (!authUser.user) {
      return { success: false, message: 'Failed to create admin user' };
    }

    // The profile is created automatically via the database trigger
    // Now update the role to 'admin'
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', authUser.user.id);

    if (updateError) {
      console.error('Error updating admin role:', updateError.message);
      return { success: false, message: updateError.message };
    }

    toast({
      title: "Admin Account Created",
      description: "Your admin account has been created successfully.",
    });

    return { 
      success: true, 
      message: 'Admin user created successfully.',
      user: authUser.user
    };
  } catch (error) {
    console.error('Unexpected error creating admin user:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
};
