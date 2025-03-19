
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  userRole: string | null;
  isLoggedIn: boolean;
  handleLoginClick: () => void;
  handleSignupClick: () => void;
  handleLogout: () => void;
  setMobileMenuOpen: (isOpen: boolean) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  userRole,
  isLoggedIn,
  handleLoginClick,
  handleSignupClick,
  handleLogout,
  setMobileMenuOpen,
}) => {
  return (
    <div
      className={`md:hidden ${
        isOpen
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
  );
};

export default MobileMenu;
