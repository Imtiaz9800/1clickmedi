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

  useEffect(() => {
    if (!isOpen) {
      setErrors({});
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
      setIsLoggedIn(true);
      toast({ title: "Account Created", description: "Please check your email for verification." });
      onOpenChange(false);
    } catch (error: any) {
      setErrors({ signupForm: error.message });
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{activeTab === "login" ? "Login" : "Sign Up"}</DialogTitle>
          <DialogDescription>
            {activeTab === "login" ? "Enter your credentials" : "Create a new account"}
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              {errors.loginForm && <p className="text-red-500">{errors.loginForm}</p>}
              <Label>Email</Label>
              <Input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
              <Label>Password</Label>
              <Input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
              <Button type="submit" disabled={loginLoading}>{loginLoading ? "Logging in..." : "Login"}</Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSignup}>
              {errors.signupForm && <p className="text-red-500">{errors.signupForm}</p>}
              <Label>Full Name</Label>
              <Input value={signupName} onChange={(e) => setSignupName(e.target.value)} />
              <Label>Email</Label>
              <Input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
              <Label>Password</Label>
              <Input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
              <Label>Confirm Password</Label>
              <Input type="password" value={signupConfirmPassword} onChange={(e) => setSignupConfirmPassword(e.target.value)} />
              <Button type="submit" disabled={signupLoading}>{signupLoading ? "Signing up..." : "Sign Up"}</Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
