
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onOpenChange,
  activeTab,
  setActiveTab,
  setIsLoggedIn,
}) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isOpen) {
      // Clear form data on modal close
      setErrors({});
      setLoginEmail("");
      setLoginPassword("");
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
      setSignupConfirmPassword("");
    }
  }, [isOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!loginEmail || !loginPassword) {
      setErrors({ loginForm: "Email and password are required." });
      return;
    }
    setLoginLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) throw error;
      setIsLoggedIn(true);
      toast({ title: "Login Successful", description: "Welcome back!" });
      onOpenChange(false);
    } catch (error: any) {
      setErrors({ loginForm: error.message });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
      setErrors({ signupForm: "All fields are required." });
      return;
    }
    if (signupPassword.length < 6) {
      setErrors({ signupPassword: "Password must be at least 6 characters." });
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setErrors({ signupConfirmPassword: "Passwords do not match." });
      return;
    }
    setSignupLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: { data: { name: signupName } },
      });
      if (error) throw error;
      
      // Check if user needs to verify email
      if (data?.user?.identities?.length === 0) {
        toast({
          title: "Email already registered",
          description: "Please login instead or use a different email",
          variant: "destructive"
        });
      } else {
        setIsLoggedIn(true);
        toast({ 
          title: "Account Created", 
          description: "Please check your email for verification if required." 
        });
        onOpenChange(false);
      }
    } catch (error: any) {
      setErrors({ signupForm: error.message });
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">{activeTab === "login" ? "Login" : "Sign Up"}</DialogTitle>
          <DialogDescription className="text-center">
            {activeTab === "login" ? "Enter your credentials to access your account" : "Create a new account to get started"}
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              {errors.loginForm && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-md">
                  {errors.loginForm}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email" 
                  value={loginEmail} 
                  onChange={(e) => setLoginEmail(e.target.value)} 
                  placeholder="Enter your email"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password" 
                  value={loginPassword} 
                  onChange={(e) => setLoginPassword(e.target.value)} 
                  placeholder="Enter your password"
                  className="w-full"
                />
              </div>
              <Button 
                type="submit" 
                disabled={loginLoading} 
                className="w-full"
              >
                {loginLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup" className="mt-4">
            <form onSubmit={handleSignup} className="space-y-4">
              {errors.signupForm && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-md">
                  {errors.signupForm}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input 
                  id="full-name"
                  value={signupName} 
                  onChange={(e) => setSignupName(e.target.value)} 
                  placeholder="Enter your full name"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input 
                  id="signup-email"
                  type="email" 
                  value={signupEmail} 
                  onChange={(e) => setSignupEmail(e.target.value)} 
                  placeholder="Enter your email"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input 
                  id="signup-password"
                  type="password" 
                  value={signupPassword} 
                  onChange={(e) => setSignupPassword(e.target.value)} 
                  placeholder="Create a password"
                  className="w-full"
                />
                {errors.signupPassword && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.signupPassword}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input 
                  id="confirm-password"
                  type="password" 
                  value={signupConfirmPassword} 
                  onChange={(e) => setSignupConfirmPassword(e.target.value)} 
                  placeholder="Confirm your password"
                  className="w-full"
                />
                {errors.signupConfirmPassword && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.signupConfirmPassword}</p>
                )}
              </div>
              <Button 
                type="submit" 
                disabled={signupLoading} 
                className="w-full"
              >
                {signupLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
