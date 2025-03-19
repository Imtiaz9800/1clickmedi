
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut } from "lucide-react";
import ThemeToggle from "../ThemeToggle";

interface UserMenuProps {
  isLoggedIn: boolean;
  handleLoginClick: () => void;
  handleSignupClick: () => void;
  handleLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({
  isLoggedIn,
  handleLoginClick,
  handleSignupClick,
  handleLogout,
}) => {
  return (
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
  );
};

export default UserMenu;
