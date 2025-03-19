
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AuthModal from "./AuthModal";
import ThemeToggle from "./ThemeToggle";
import NavbarBrand from "./navbar/NavbarBrand";
import NavLinks from "./navbar/NavLinks";
import UserMenu from "./navbar/UserMenu";
import MobileMenu from "./navbar/MobileMenu";

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
            <NavbarBrand />

            {/* Desktop Navigation */}
            <NavLinks userRole={userRole} />

            {/* Auth buttons or user menu + Theme Toggle */}
            <UserMenu
              isLoggedIn={isLoggedIn}
              handleLoginClick={handleLoginClick}
              handleSignupClick={handleSignupClick}
              handleLogout={handleLogout}
            />

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
        <MobileMenu
          isOpen={mobileMenuOpen}
          userRole={userRole}
          isLoggedIn={isLoggedIn}
          handleLoginClick={handleLoginClick}
          handleSignupClick={handleSignupClick}
          handleLogout={handleLogout}
          setMobileMenuOpen={setMobileMenuOpen}
        />
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
