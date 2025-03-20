
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
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

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
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  // Form error state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Add a success state
  const [authSuccess, setAuthSuccess] = useState(false);

  // Effect to close modal after successful auth with delay
  useEffect(() => {
    if (authSuccess) {
      const timer = setTimeout(() => {
        onOpenChange(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [authSuccess, onOpenChange]);

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const newErrors: Record<string, string> = {};
    if (!loginEmail) {
      newErrors.loginEmail = "Email is required";
    }
    if (!loginPassword) {
      newErrors.loginPassword = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Perform login with Supabase
    setLoginLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        setErrors({
          loginForm: error.message,
        });
        return;
      }

      if (data.user) {
        setIsLoggedIn(true);
        setAuthSuccess(true);
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
      }
    } catch (error) {
      setErrors({
        loginForm: "An error occurred. Please try again.",
      });
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle signup form submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const newErrors: Record<string, string> = {};
    if (!signupName) {
      newErrors.signupName = "Name is required";
    }
    if (!signupEmail) {
      newErrors.signupEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(signupEmail)) {
      newErrors.signupEmail = "Email is invalid";
    }
    if (!signupPassword) {
      newErrors.signupPassword = "Password is required";
    } else if (signupPassword.length < 6) {
      newErrors.signupPassword = "Password must be at least 6 characters";
    }
    if (signupPassword !== signupConfirmPassword) {
      newErrors.signupConfirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Perform signup with Supabase
    setSignupLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            first_name: signupName.split(' ')[0],
            last_name: signupName.split(' ').slice(1).join(' '),
          },
        },
      });

      if (error) {
        setErrors({
          signupForm: error.message,
        });
        return;
      }

      if (data.user) {
        setIsLoggedIn(true);
        setAuthSuccess(true);
        toast({
          title: "Account created",
          description: "Welcome to DocFinder!",
        });
        
        // Clear form after successful signup
        setSignupName("");
        setSignupEmail("");
        setSignupPassword("");
        setSignupConfirmPassword("");
      }
    } catch (error) {
      setErrors({
        signupForm: "An error occurred. Please try again.",
      });
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-2xl font-semibold text-center">
            {activeTab === "login" ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {activeTab === "login"
              ? "Enter your credentials to access your account"
              : "Join DocFinder to discover healthcare services"}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mt-2"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === "login" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === "login" ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="login" className="p-6 pb-8 space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  {errors.loginForm && (
                    <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">
                      {errors.loginForm}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className={errors.loginEmail ? "border-red-500" : ""}
                    />
                    {errors.loginEmail && (
                      <p className="text-red-500 text-xs mt-1">{errors.loginEmail}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="text-xs text-medical-600 hover:text-medical-800"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className={errors.loginPassword ? "border-red-500" : ""}
                    />
                    {errors.loginPassword && (
                      <p className="text-red-500 text-xs mt-1">{errors.loginPassword}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-medical-600 hover:bg-medical-700"
                    disabled={loginLoading}
                  >
                    {loginLoading ? "Logging in..." : "Login"}
                  </Button>

                  <div className="text-xs text-center text-gray-600 mt-4">
                    <p>After creating an account, you'll need to verify your email</p>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="p-6 pb-8 space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  {errors.signupForm && (
                    <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">
                      {errors.signupForm}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className={errors.signupName ? "border-red-500" : ""}
                    />
                    {errors.signupName && (
                      <p className="text-red-500 text-xs mt-1">{errors.signupName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className={errors.signupEmail ? "border-red-500" : ""}
                    />
                    {errors.signupEmail && (
                      <p className="text-red-500 text-xs mt-1">{errors.signupEmail}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className={errors.signupPassword ? "border-red-500" : ""}
                    />
                    {errors.signupPassword && (
                      <p className="text-red-500 text-xs mt-1">{errors.signupPassword}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      className={errors.signupConfirmPassword ? "border-red-500" : ""}
                    />
                    {errors.signupConfirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{errors.signupConfirmPassword}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-medical-600 hover:bg-medical-700"
                    disabled={signupLoading}
                  >
                    {signupLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
