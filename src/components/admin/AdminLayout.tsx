
import React, { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  Building, 
  Stethoscope, 
  Microscope, 
  Store, 
  Home, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  MessageCircle,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
      });
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        variant: "destructive",
      });
    }
  };
  
  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <Home className="w-5 h-5" /> },
    { name: "Doctors", path: "/admin/doctors", icon: <Stethoscope className="w-5 h-5" /> },
    { name: "Hospitals", path: "/admin/hospitals", icon: <Building className="w-5 h-5" /> },
    { name: "Medical Shops", path: "/admin/medical-shops", icon: <Store className="w-5 h-5" /> },
    { name: "Pathology Labs", path: "/admin/labs", icon: <Microscope className="w-5 h-5" /> },
    { name: "Contact Messages", path: "/admin/contact", icon: <MessageCircle className="w-5 h-5" /> },
    { name: "Settings", path: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
  ];
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Admin Header - Fixed position */}
      <header className="bg-white dark:bg-gray-800 shadow-sm fixed top-0 left-0 right-0 z-30">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="md:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <Link to="/admin" className="text-xl font-semibold text-blue-800 dark:text-blue-300 flex items-center">
              <span className="bg-blue-600 dark:bg-blue-800 text-white p-1 rounded-md mr-2">Doc</span>
              <span>Finder</span>
              <span className="ml-2 text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                Admin
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </Button>
            <Link to="/">
              <Button variant="outline" size="sm">
                Back to Site
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Add padding for fixed header */}
      <div className="pt-16 flex flex-1 overflow-hidden">
        {/* Sidebar - Fixed position below the header */}
        <aside 
          className={`fixed md:sticky top-16 left-0 z-20 w-64 bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out md:translate-x-0 h-[calc(100vh-64px)] ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } flex-shrink-0 overflow-y-auto`}
        >
          <nav className="py-4 px-3 h-full">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-100"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                  {location.pathname === item.path && (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </Link>
              ))}
            </div>
            
            <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-md transition-colors"
                onClick={handleSignOut}
              >
                <LogOut className="mr-3 h-5 w-5" />
                <span>Sign Out</span>
              </Button>
            </div>
          </nav>
        </aside>

        {/* Main content - Adjusted with padding to accommodate fixed header */}
        <div className={`flex-1 overflow-auto p-4 md:p-8 ${sidebarOpen && isMobile ? 'opacity-50' : 'opacity-100'}`}>
          {title && (
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
            </div>
          )}
          {children}
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10 mt-16"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default AdminLayout;
