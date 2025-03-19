
import { supabase } from "@/integrations/supabase/client";

export const createAdminUser = async (email: string, password: string) => {
  try {
    // First check if the user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    
    if (existingUser) {
      console.log('Admin user already exists');
      return { success: true, message: 'Admin user already exists' };
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

    return { 
      success: true, 
      message: 'Admin user created successfully. Please verify your email to complete registration.' 
    };
  } catch (error) {
    console.error('Unexpected error creating admin user:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
};
