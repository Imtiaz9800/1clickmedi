
import React from "react";
import { Link } from "react-router-dom";

interface NavLinksProps {
  userRole: string | null;
}

const NavLinks: React.FC<NavLinksProps> = ({ userRole }) => {
  return (
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
  );
};

export default NavLinks;
