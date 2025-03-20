
import React from "react";
import { Button } from "@/components/ui/button";

const CTASection: React.FC = () => {
  return (
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
  );
};

export default CTASection;
