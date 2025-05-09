
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
import { Store, MapPin, Phone, Clock, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MedicalShop {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  opening_hours: string;
  services: string[];
  image_url: string | null;
  rating: number | null;
}

const MedicalShopsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [medicalShops, setMedicalShops] = useState<MedicalShop[]>([]);
  const [filteredShops, setFilteredShops] = useState<MedicalShop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [serviceFilter, setServiceFilter] = useState(searchParams.get("service") || "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMedicalShops();
  }, []);

  useEffect(() => {
    if (searchTerm || serviceFilter) {
      const filtered = medicalShops.filter((shop) => {
        const matchesSearch = !searchTerm || 
          shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.state.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesService = !serviceFilter || 
          shop.services.some(service => 
            service.toLowerCase().includes(serviceFilter.toLowerCase())
          );
        
        return matchesSearch && matchesService;
      });
      setFilteredShops(filtered);
    } else {
      setFilteredShops(medicalShops);
    }
  }, [searchTerm, serviceFilter, medicalShops]);

  const fetchMedicalShops = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First check if we can get data from Supabase
      let { data, error } = await supabase
        .from('medical_shops')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setMedicalShops(data);
        setFilteredShops(data);
      } else {
        // Fallback to demo data if no data in Supabase
        const demoShops = [
          {
            id: "demo1",
            name: "MedPlus Pharmacy",
            address: "123 Medical Lane",
            city: "Mumbai",
            state: "Maharashtra",
            phone: "+91-9876543210",
            email: "medplus@example.com",
            opening_hours: "Mon-Sat: 9 AM - 9 PM",
            services: ["24/7 Service", "Home Delivery", "Prescription Refills"],
            image_url: null,
            rating: 4.7
          },
          {
            id: "demo2",
            name: "Apollo Pharmacy",
            address: "456 Health Avenue",
            city: "Delhi",
            state: "Delhi",
            phone: "+91-8765432109",
            email: "apollo@example.com",
            opening_hours: "24/7",
            services: ["Online Consultations", "Medicine Delivery", "Health Products"],
            image_url: null,
            rating: 4.5
          }
        ];
        
        setMedicalShops(demoShops);
        setFilteredShops(demoShops);
      }
    } catch (error) {
      console.error("Error fetching medical shops:", error);
      setError("Failed to load medical shops. Please try again later.");
      
      // Set demo data as fallback
      const demoShops = [
        {
          id: "demo1",
          name: "MedPlus Pharmacy",
          address: "123 Medical Lane",
          city: "Mumbai", 
          state: "Maharashtra",
          phone: "+91-9876543210",
          email: "medplus@example.com",
          opening_hours: "Mon-Sat: 9 AM - 9 PM",
          services: ["24/7 Service", "Home Delivery", "Prescription Refills"],
          image_url: null,
          rating: 4.7
        }
      ];
      
      setMedicalShops(demoShops);
      setFilteredShops(demoShops);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search params
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (serviceFilter) params.set("service", serviceFilter);
    navigate(`/medical-shops?${params.toString()}`);
  };

  // Calculate all unique services for the filter
  const allServices = React.useMemo(() => {
    const servicesSet = new Set<string>();
    medicalShops.forEach(shop => {
      shop.services.forEach(service => {
        servicesSet.add(service);
      });
    });
    return Array.from(servicesSet).sort();
  }, [medicalShops]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Medical Shops</h1>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
                Find trusted medical shops and pharmacies across India. Browse by location or service to find the right medical store for your needs.
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Search and Filter Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-8">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <select
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                >
                  <option value="">All Services</option>
                  {allServices.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>
              <Button type="submit">Search</Button>
            </form>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-medical-600" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">Loading medical shops...</span>
            </div>
          ) : filteredShops.length === 0 ? (
            <div className="text-center py-20">
              <Store className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No medical shops found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                We couldn't find any medical shops matching your search criteria. Please try with different search terms.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShops.map((shop) => (
                <Card key={shop.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-12 w-12 mr-4 border-2 border-white">
                            {shop.image_url ? (
                              <AvatarImage src={shop.image_url} alt={shop.name} />
                            ) : null}
                            <AvatarFallback className="bg-emerald-200 text-emerald-700 dark:bg-emerald-700 dark:text-emerald-100 text-lg">
                              {shop.name ? shop.name[0].toUpperCase() : "M"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{shop.name}</h3>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              <span>{shop.city}, {shop.state}</span>
                            </div>
                          </div>
                        </div>
                        {shop.rating && (
                          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100 hover:bg-emerald-200 dark:hover:bg-emerald-700">
                            {shop.rating.toFixed(1)} ★
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="mb-4">
                        <div className="flex items-start mb-2">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{shop.address}</span>
                        </div>
                        <div className="flex items-center mb-2">
                          <Phone className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{shop.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{shop.opening_hours}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Services:</h4>
                        <div className="flex flex-wrap gap-2">
                          {shop.services.slice(0, 3).map((service, index) => (
                            <Badge key={index} variant="outline" className="bg-gray-100 dark:bg-gray-700">
                              {service}
                            </Badge>
                          ))}
                          {shop.services.length > 3 && (
                            <Badge variant="outline" className="bg-gray-100 dark:bg-gray-700">
                              +{shop.services.length - 3} more
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

export default MedicalShopsPage;
