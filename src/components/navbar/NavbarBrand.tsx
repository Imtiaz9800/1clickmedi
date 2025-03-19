
import React from "react";
import { Link } from "react-router-dom";

const NavbarBrand: React.FC = () => {
  return (
    <Link
      to="/"
      className="flex items-center space-x-2 text-xl font-semibold text-medical-800 dark:text-white"
    >
      <span className="bg-medical-600 text-white p-1 rounded-md">Doc</span>
      <span>Finder</span>
    </Link>
  );
};

export default NavbarBrand;
