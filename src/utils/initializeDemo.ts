
import { createAdminUser } from "./createAdminUser";
import { toast } from "@/components/ui/use-toast";

export const initializeDemo = async () => {
  // Create demo admin user
  const result = await createAdminUser("admin@gmail.com", "123456");
  
  if (result.success) {
    toast({
      title: "Demo Admin Created",
      description: result.message,
    });
  } else {
    toast({
      title: "Failed to Create Demo Admin",
      description: result.message,
      variant: "destructive",
    });
  }
};
