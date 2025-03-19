
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualifications: string;
  experience: number;
  bio: string;
  image_url: string | null;
  rating: number | null;
  category_id: string | null;
  category_name?: string;
}

const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const { data: doctorsData, error } = await supabase
          .from("doctors")
          .select("*");

        if (error) {
          throw error;
        }

        // Get categories for each doctor
        const enhancedDoctors = await Promise.all(
          (doctorsData || []).map(async (doctor: Doctor) => {
            if (doctor.category_id) {
              const { data: categoryData } = await supabase
                .from("categories")
                .select("name")
                .eq("id", doctor.category_id)
                .single();
              
              return {
                ...doctor,
                category_name: categoryData?.name || "Unknown Category"
              };
            }
            return {
              ...doctor,
              category_name: "Unknown Category"
            };
          })
        );

        setDoctors(enhancedDoctors);
        setFilteredDoctors(enhancedDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (doctor.category_name && doctor.category_name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredDoctors(filtered);
    }
  }, [searchQuery, doctors]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const renderStarRating = (rating: number | null) => {
    if (!rating) return "Not rated";
    
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Find a Doctor
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
            Browse through our directory of qualified healthcare professionals. Find the right doctor based on specialty, location, or reviews.
          </p>
        </motion.div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, specialty or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>
            <Button className="bg-medical-100 hover:bg-medical-200 text-medical-800 dark:bg-medical-800 dark:hover:bg-medical-700 dark:text-medical-100">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader className="h-24 bg-gray-200 dark:bg-gray-700"></CardHeader>
                <CardContent className="pt-6">
                  <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 mb-4 rounded"></div>
                  <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 mb-2 rounded"></div>
                  <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 mb-2 rounded"></div>
                  <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 mb-2 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">No doctors found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="h-full flex flex-col hover:shadow-md transition-shadow overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <CardHeader className="pb-0">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-14 w-14 border-2 border-medical-100 dark:border-medical-700">
                        {doctor.image_url ? (
                          <AvatarImage src={doctor.image_url} alt={doctor.name} />
                        ) : null}
                        <AvatarFallback className="bg-medical-100 text-medical-800 dark:bg-medical-800 dark:text-medical-100 text-lg">
                          {getInitials(doctor.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                          {doctor.name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-medical-50 text-medical-700 dark:bg-medical-900 dark:text-medical-300 border-medical-200 dark:border-medical-700">
                            {doctor.specialty}
                          </Badge>
                          {doctor.category_name && (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300 border-gray-200 dark:border-gray-700">
                              {doctor.category_name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 flex-grow">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {doctor.qualifications}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-2">
                      {doctor.bio}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Experience:</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {doctor.experience} years
                      </span>
                    </div>
                  </CardContent>
                  <Separator className="my-2" />
                  <CardFooter className="pt-2 pb-4 flex justify-between">
                    <div className="text-yellow-500 text-sm">
                      {renderStarRating(doctor.rating)}
                    </div>
                    <Button
                      variant="outline"
                      className="border-medical-200 text-medical-700 hover:bg-medical-50 hover:text-medical-800 dark:border-medical-700 dark:text-medical-300 dark:hover:bg-medical-900"
                      size="sm"
                    >
                      View Profile
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DoctorsPage;
