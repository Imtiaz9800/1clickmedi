
import React from "react";
import Layout from "@/components/Layout";
import SearchBar from "@/components/SearchBar";
import FeaturedSection from "@/components/FeaturedSection";
import CategoryCards from "@/components/CategoryCards";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Building, Microscope, Stethoscope, Store } from "lucide-react";

const Index: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pb-6 pt-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-medical-50/30 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight mb-4">
                Find the Right Healthcare Provider for Your Needs
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-lg text-gray-600 mb-8">
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
          </div>
        </div>

        <div className="hidden md:block absolute -bottom-14 -left-14 w-64 h-64 rounded-full bg-medical-100/50 blur-3xl" />
        <div className="hidden md:block absolute -bottom-24 -right-20 w-80 h-80 rounded-full bg-medical-50/60 blur-3xl" />
      </section>

      {/* Services Section */}
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
            {[
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
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl p-6 border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow card-hover"
              >
                <div className={`rounded-full w-14 h-14 ${service.color} flex items-center justify-center mb-5`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-5">
                  {service.description}
                </p>
                <Button
                  variant="link"
                  className="p-0 h-auto text-medical-600 hover:text-medical-800"
                  asChild
                >
                  <a href={service.link}>Browse {service.title} →</a>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <CategoryCards />

      {/* Featured Section */}
      <FeaturedSection />

      {/* CTA Section */}
      <section className="py-16 bg-medical-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
                Are You a Healthcare Provider?
              </h2>
              <p className="text-medical-50">
                Join our network to connect with patients, grow your practice, and manage your profile with ease.
                Register as a doctor, list your medical shop, pathology lab, or hospital.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                className="rounded-full border-white text-white hover:bg-white hover:text-medical-600"
              >
                Join as Provider
              </Button>
              <Button
                className="rounded-full bg-white text-medical-600 hover:bg-medical-50"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
