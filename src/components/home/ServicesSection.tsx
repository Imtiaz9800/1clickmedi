import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Building, Microscope, Stethoscope, Store } from "lucide-react";
import { Link } from "react-router-dom";

const ServiceCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color: string;
  index: number;
}> = ({ title, description, icon, link, color, index }) => {
  return (
    <Link to={link}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="rounded-xl p-6 border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow card-hover cursor-pointer"
      >
        <div className={`rounded-full w-14 h-14 ${color} flex items-center justify-center mb-5`}>
          {icon}
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 mb-5">
          {description}
        </p>
        <div
          className="text-medical-600 hover:text-medical-800 font-medium"
        >
          Browse {title} →
        </div>
      </motion.div>
    </Link>
  );
};

const ServicesSection: React.FC = () => {
  const services = [
    {
      title: "Doctors",
      description:
        "Find qualified doctors across various specialties for consultations and treatments.",
      icon: <Stethoscope className="h-8 w-8" />,
      link: "/doctors",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Medical Shops",
      description:
        "Locate nearby pharmacies and medical stores for medicines and health products.",
      icon: <Store className="h-8 w-8" />,
      link: "/medical-shops",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Pathology Labs",
      description:
        "Access diagnostic and pathology labs for tests and health checkups.",
      icon: <Microscope className="h-8 w-8" />,
      link: "/labs",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Hospitals",
      description:
        "Connect with the best hospitals and healthcare centers in your area.",
      icon: <Building className="h-8 w-8" />,
      link: "/hospitals",
      color: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Our Healthcare Services
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            We provide access to a variety of healthcare services to meet all your medical needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              index={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              link={service.link}
              color={service.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
