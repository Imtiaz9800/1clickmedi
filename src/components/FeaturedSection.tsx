
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StarIcon, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface FeaturedItemProps {
  name: string;
  type: "doctor" | "shop" | "lab" | "hospital";
  specialty?: string;
  rating: number;
  image: string;
  location: string;
  delay: number;
  link: string;
}

const typeLabels = {
  doctor: "Doctor",
  shop: "Medical Shop",
  lab: "Pathology Lab",
  hospital: "Hospital",
};

const typeColors = {
  doctor: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  shop: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
  lab: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
  hospital: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
};

const FeaturedItem: React.FC<FeaturedItemProps> = ({
  name,
  type,
  specialty,
  rating,
  image,
  location,
  delay,
  link,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      <Link to={link}>
        <Card className="overflow-hidden card-hover border border-gray-100 dark:border-gray-800 cursor-pointer dark:bg-gray-800/50">
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 rounded-xl border border-gray-100 dark:border-gray-700">
                  <AvatarImage src={image} alt={name} />
                  <AvatarFallback className="rounded-xl bg-medical-100 text-medical-700 text-lg dark:bg-medical-900 dark:text-medical-300">
                    {name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="font-medium text-lg dark:text-white">{name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`${typeColors[type]}`}>
                      {typeLabels[type]}
                    </Badge>
                    {specialty && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">{specialty}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  {location}
                </div>
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
                  <span className="ml-1 text-sm font-medium dark:text-gray-300">{rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

const FeaturedSection: React.FC = () => {
  const featuredItems = [
    {
      name: "Dr. Sarah Johnson",
      type: "doctor" as const,
      specialty: "Cardiologist",
      rating: 4.9,
      image: "/placeholder.svg",
      location: "Central Hospital, New York",
      link: "/doctors/sarah-johnson"
    },
    {
      name: "MedPlus Pharmacy",
      type: "shop" as const,
      rating: 4.7,
      image: "/placeholder.svg",
      location: "Broadway St, New York",
      link: "/medical-shops/medplus-pharmacy"
    },
    {
      name: "CityLab Diagnostics",
      type: "lab" as const,
      specialty: "Full Body Checkup",
      rating: 4.8,
      image: "/placeholder.svg",
      location: "5th Avenue, New York",
      link: "/labs/citylab-diagnostics"
    },
    {
      name: "Metro General Hospital",
      type: "hospital" as const,
      rating: 4.6,
      image: "/placeholder.svg",
      location: "Park Avenue, New York",
      link: "/hospitals/metro-general"
    },
  ];

  return (
    <section className="py-12 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Featured Healthcare</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Top-rated healthcare providers in your area</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item, index) => (
            <FeaturedItem key={index} {...item} delay={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
