
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import { initializeDemo } from "@/utils/initializeDemo";
import { toast } from "@/components/ui/use-toast";

const HeroSection: React.FC = () => {
  const handleInitializeDemo = async () => {
    try {
      await initializeDemo();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize demo data",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="relative pb-6 pt-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-medical-50/30 to-transparent dark:from-gray-900/50 dark:to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white to-transparent dark:from-gray-900 dark:to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight mb-4">
              Find the Right Healthcare Provider for Your Needs
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Connect with doctors, medical shops, pathology labs, and hospitals - all in one place
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full"
          >
            <SearchBar />
          </motion.div>

          {/* Demo initialization button - text removed as requested */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6"
          >
            <Button 
              variant="outline" 
              onClick={handleInitializeDemo}
              className="bg-medical-50 text-medical-600 border-medical-200 hover:bg-medical-100 dark:bg-medical-900 dark:text-medical-300 dark:border-medical-800 dark:hover:bg-medical-800"
            >
              Admin Portal Access
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="hidden md:block absolute -bottom-14 -left-14 w-64 h-64 rounded-full bg-medical-100/50 dark:bg-medical-900/30 blur-3xl" />
      <div className="hidden md:block absolute -bottom-24 -right-20 w-80 h-80 rounded-full bg-medical-50/60 dark:bg-medical-900/20 blur-3xl" />
    </section>
  );
};

export default HeroSection;
