
import React, { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ContactButton from "./ContactButton";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main 
          className={`flex-grow ${isMobile ? 'pt-16 pb-20' : 'pt-20 pb-16'}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <ContactButton />
      <Footer />
    </div>
  );
};

export default Layout;
