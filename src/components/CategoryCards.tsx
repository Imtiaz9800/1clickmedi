
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Brain, Eye, Tooth, Bone, Baby, Stethoscope, Users } from "lucide-react";

interface CategoryCardProps {
  name: string;
  icon: React.ReactNode;
  count: number;
  delay: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, icon, count, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: delay * 0.05 }}
    >
      <Card className="card-hover bg-white border border-gray-100 h-full">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="p-3 rounded-full bg-medical-50 text-medical-600 mb-4">
            {icon}
          </div>
          <h3 className="font-medium text-base mb-1">{name}</h3>
          <p className="text-sm text-gray-500">{count} Specialists</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const CategoryCards: React.FC = () => {
  const categories = [
    {
      name: "Cardiology",
      icon: <Heart className="h-6 w-6" />,
      count: 128,
    },
    {
      name: "Neurology",
      icon: <Brain className="h-6 w-6" />,
      count: 87,
    },
    {
      name: "Ophthalmology",
      icon: <Eye className="h-6 w-6" />,
      count: 96,
    },
    {
      name: "Dentistry",
      icon: <Tooth className="h-6 w-6" />,
      count: 142,
    },
    {
      name: "Orthopedics",
      icon: <Bone className="h-6 w-6" />,
      count: 105,
    },
    {
      name: "Pediatrics",
      icon: <Baby className="h-6 w-6" />,
      count: 134,
    },
    {
      name: "General Medicine",
      icon: <Stethoscope className="h-6 w-6" />,
      count: 215,
    },
    {
      name: "Family Medicine",
      icon: <Users className="h-6 w-6" />,
      count: 176,
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Browse by Specialty</h2>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Find specialized healthcare professionals across various medical fields
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              name={category.name}
              icon={category.icon}
              count={category.count}
              delay={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
