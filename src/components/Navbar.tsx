
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, User, LogOut, Search } from "lucide-react";
import AuthModal from "./AuthModal";
import ThemeToggle from "./ThemeToggle";
import { supabase } from "@/integrations/supabase/client";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsLoggedIn(true);
        // Get user role
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .single();
        if (profileData) {
          setUserRole(profileData.role);
        }
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setIsLoggedIn(true);
          // Get user role
          const { data: profileData } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          if (profileData) {
            setUserRole(profileData.role);
          }
        } else {
          setIsLoggedIn(false);
          setUserRole(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLoginClick = () => {
    setActiveTab("login");
    setAuthModalOpen(true);
  };

  const handleSignupClick = () => {
    setActiveTab("signup");
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-semibold text-medical-800 dark:text-white"
            >
              <span className="bg-medical-600 text-white p-1 rounded-md">Doc</span>
              <span>Finder</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-medical-600 dark:hover:text-medical-400 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/doctors"
                className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-medical-600 dark:hover:text-medical-400 transition-colors"
              >
                Doctors
              </Link>
              <Link
                to="/medical-shops"
                className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-medical-600 dark:hover:text-medical-400 transition-colors"
              >
                Medical Shops
              </Link>
              <Link
                to="/labs"
                className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-medical-600 dark:hover:text-medical-400 transition-colors"
              >
                Labs
              </Link>
              <Link
                to="/hospitals"
                className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-medical-600 dark:hover:text-medical-400 transition-colors"
              >
                Hospitals
              </Link>
              {userRole === 'admin' && (
                <Link
                  to="/admin"
                  className="text-sm font-medium text-medical-600 dark:text-medical-400 hover:text-medical-800 dark:hover:text-medical-300 transition-colors"
                >
                  Admin Dashboard
                </Link>
              )}
            </nav>

            {/* Auth buttons or user menu + Theme Toggle */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              
              {isLoggedIn ? (
                <div className="relative group">
                  <Button variant="ghost" className="p-0 h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt="User" />
                      <AvatarFallback className="bg-medical-100 text-medical-800 dark:bg-medical-800 dark:text-medical-100">
                        JD
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                  <div className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="rounded-full border-medical-200 text-medical-800 dark:border-medical-700 dark:text-medical-100 hover:bg-medical-50 dark:hover:bg-medical-900"
                    onClick={handleLoginClick}
                  >
                    Login
                  </Button>
                  <Button
                    className="rounded-full bg-medical-600 hover:bg-medical-700 dark:bg-medical-500 dark:hover:bg-medical-600 text-white"
                    onClick={handleSignupClick}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <button
                className="p-2 rounded-md"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden ${
            mobileMenuOpen
              ? "max-h-screen opacity-100 visible"
              : "max-h-0 opacity-0 invisible"
          } transition-all duration-300 overflow-hidden bg-white dark:bg-gray-900`}
        >
          <div className="px-4 py-3 space-y-3">
            <Link
              to="/"
              className="block py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-medical-600 dark:hover:text-medical-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/doctors"
              className="block py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-medical-600 dark:hover:text-medical-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              Doctors
            </Link>
            <Link
              to="/medical-shops"
              className="block py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-medical-600 dark:hover:text-medical-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              Medical Shops
            </Link>
            <Link
              to="/labs"
              className="block py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-medical-600 dark:hover:text-medical-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              Labs
            </Link>
            <Link
              to="/hospitals"
              className="block py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-medical-600 dark:hover:text-medical-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hospitals
            </Link>
            {userRole === 'admin' && (
              <Link
                to="/admin"
                className="block py-2 text-base font-medium text-medical-600 dark:text-medical-400 hover:text-medical-800 dark:hover:text-medical-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            {isLoggedIn ? (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link
                  to="/profile"
                  className="flex items-center py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-medical-600 dark:hover:text-medical-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5 mr-2" />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-medical-600 dark:hover:text-medical-400"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col space-y-3">
                <Button
                  variant="outline"
                  className="w-full rounded-full border-medical-200 text-medical-800 dark:border-medical-700 dark:text-medical-100 hover:bg-medical-50 dark:hover:bg-medical-900"
                  onClick={() => {
                    handleLoginClick();
                    setMobileMenuOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button
                  className="w-full rounded-full bg-medical-600 hover:bg-medical-700 dark:bg-medical-500 dark:hover:bg-medical-600 text-white"
                  onClick={() => {
                    handleSignupClick();
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onOpenChange={setAuthModalOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setIsLoggedIn={setIsLoggedIn}
      />
    </>
  );
};

export default Navbar;
