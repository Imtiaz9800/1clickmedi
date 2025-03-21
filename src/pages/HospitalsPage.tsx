
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Phone, Loader2, AlertCircle, ShieldCheck } from "lucide-react";

interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  specialties: string[];
  facilities: string[];
  emergency_services: boolean;
  beds: number | null;
  image_url: string | null;
}

const HospitalsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [specialtyFilter, setSpecialtyFilter] = useState(searchParams.get("specialty") || "");
  const [emergencyFilter, setEmergencyFilter] = useState(searchParams.get("emergency") === "true");

  useEffect(() => {
    fetchHospitals();
  }, []);

  useEffect(() => {
    if (searchTerm || specialtyFilter || emergencyFilter) {
      const filtered = hospitals.filter(hospital => {
        const matchesSearch = !searchTerm || hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) || hospital.city.toLowerCase().includes(searchTerm.toLowerCase()) || hospital.state.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialty = !specialtyFilter || hospital.specialties.some(specialty => specialty.toLowerCase().includes(specialtyFilter.toLowerCase()));
        const matchesEmergency = !emergencyFilter || hospital.emergency_services;
        return matchesSearch && matchesSpecialty && matchesEmergency;
      });
      setFilteredHospitals(filtered);
    } else {
      setFilteredHospitals(hospitals);
    }
  }, [searchTerm, specialtyFilter, emergencyFilter, hospitals]);

  const fetchHospitals = async () => {
    try {
      setIsLoading(true);
      const {
        data,
        error
      } = await supabase.from('hospitals').select('*').order('name');
      if (error) {
        throw error;
      }
      setHospitals(data || []);
      setFilteredHospitals(data || []);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search params
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (specialtyFilter) params.set("specialty", specialtyFilter);
    if (emergencyFilter) params.set("emergency", "true");
    navigate(`/hospitals?${params.toString()}`);
  };

  // Calculate all unique specialties for the filter
  const allSpecialties = React.useMemo(() => {
    const specialtiesSet = new Set<string>();
    hospitals.forEach(hospital => {
      hospital.specialties.forEach(specialty => {
        specialtiesSet.add(specialty);
      });
    });
    return Array.from(specialtiesSet).sort();
  }, [hospitals]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Hospitals</h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl">
                Find leading hospitals and healthcare centers across India. Search by location, specialty, or services to find the right medical facility for your needs.
              </p>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 md:mb-8">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <div>
                <Input 
                  placeholder="Search by name or location..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  className="w-full"
                />
              </div>
              <div>
                <select 
                  className="w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200" 
                  value={specialtyFilter} 
                  onChange={e => setSpecialtyFilter(e.target.value)}
                >
                  <option value="">All Specialties</option>
                  {allSpecialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="emergencyServices" 
                  checked={emergencyFilter} 
                  onChange={e => setEmergencyFilter(e.target.checked)} 
                  className="h-4 w-4 mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                />
                <label htmlFor="emergencyServices" className="text-gray-700 dark:text-gray-300 text-sm md:text-base">
                  Emergency Services Available
                </label>
              </div>
              <Button type="submit">Search</Button>
            </form>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">Loading hospitals...</span>
            </div>
          ) : filteredHospitals.length === 0 ? (
            <div className="text-center py-20">
              <Building className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No hospitals found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                We couldn't find any hospitals matching your search criteria. Please try with different search terms.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredHospitals.map(hospital => (
                <Card key={hospital.id} className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/30 p-4 md:p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-12 w-12 mr-4 border-2 border-white">
                            {hospital.image_url ? <AvatarImage src={hospital.image_url} alt={hospital.name} /> : null}
                            <AvatarFallback className="bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-50 text-lg">
                              {hospital.name[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                              {hospital.name}
                              {hospital.emergency_services && (
                                <Badge className="ml-2 bg-red-100 text-red-800 dark:bg-red-900/70 dark:text-red-100">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Emergency
                                </Badge>
                              )}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              <span>{hospital.city}, {hospital.state}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 md:p-6 flex-grow">
                      <div className="mb-4">
                        <div className="flex items-start mb-2">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{hospital.address}</span>
                        </div>
                        <div className="flex items-center mb-2">
                          <Phone className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{hospital.phone}</span>
                        </div>
                        {hospital.beds && (
                          <div className="flex items-center mb-2">
                            <ShieldCheck className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300 text-sm">{hospital.beds} Beds Available</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Specialties:</h4>
                        <div className="flex flex-wrap gap-2">
                          {hospital.specialties.slice(0, 3).map((specialty, index) => (
                            <Badge key={index} variant="outline" className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                              {specialty}
                            </Badge>
                          ))}
                          {hospital.specialties.length > 3 && (
                            <Badge variant="outline" className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                              +{hospital.specialties.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Facilities:</h4>
                        <div className="flex flex-wrap gap-2">
                          {hospital.facilities.slice(0, 3).map((facility, index) => (
                            <Badge key={index} variant="outline" className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                              {facility}
                            </Badge>
                          ))}
                          {hospital.facilities.length > 3 && (
                            <Badge variant="outline" className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                              +{hospital.facilities.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default HospitalsPage;
