
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="rounded-full bg-background/10 backdrop-blur-sm hover:bg-background/20 dark:text-white dark:hover:text-yellow-300 transition-all duration-300"
    >
      {theme === "light" ? (
        <Sun className="h-5 w-5 text-amber-500 hover:rotate-12 transition-transform" />
      ) : (
        <Moon className="h-5 w-5 text-blue-300 hover:-rotate-12 transition-transform" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
