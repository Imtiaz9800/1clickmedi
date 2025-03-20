
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
import { Microscope, MapPin, Phone, Clock, Loader2 } from "lucide-react";

interface PathologyLab {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  opening_hours: string;
  tests_offered: string[];
  image_url: string | null;
  rating: number | null;
}

const LabsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [labs, setLabs] = useState<PathologyLab[]>([]);
  const [filteredLabs, setFilteredLabs] = useState<PathologyLab[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [testFilter, setTestFilter] = useState(searchParams.get("test") || "");

  useEffect(() => {
    fetchLabs();
  }, []);

  useEffect(() => {
    if (searchTerm || testFilter) {
      const filtered = labs.filter((lab) => {
        const matchesSearch = !searchTerm || 
          lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lab.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lab.state.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesTest = !testFilter || 
          lab.tests_offered.some(test => 
            test.toLowerCase().includes(testFilter.toLowerCase())
          );
        
        return matchesSearch && matchesTest;
      });
      setFilteredLabs(filtered);
    } else {
      setFilteredLabs(labs);
    }
  }, [searchTerm, testFilter, labs]);

  const fetchLabs = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('pathology_labs')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setLabs(data || []);
      setFilteredLabs(data || []);
    } catch (error) {
      console.error("Error fetching pathology labs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search params
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (testFilter) params.set("test", testFilter);
    navigate(`/labs?${params.toString()}`);
  };

  // Calculate all unique tests for the filter
  const allTests = React.useMemo(() => {
    const testsSet = new Set<string>();
    labs.forEach(lab => {
      lab.tests_offered.forEach(test => {
        testsSet.add(test);
      });
    });
    return Array.from(testsSet).sort();
  }, [labs]);

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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Pathology Labs</h1>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
                Find reliable diagnostic and pathology laboratories across India. Search by location or specific tests to find the right lab for your health needs.
              </p>
            </div>
          </div>

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
                  className="w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md"
                  value={testFilter}
                  onChange={(e) => setTestFilter(e.target.value)}
                >
                  <option value="">All Tests</option>
                  {allTests.map(test => (
                    <option key={test} value={test}>{test}</option>
                  ))}
                </select>
              </div>
              <Button type="submit">Search</Button>
            </form>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">Loading pathology labs...</span>
            </div>
          ) : filteredLabs.length === 0 ? (
            <div className="text-center py-20">
              <Microscope className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No pathology labs found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                We couldn't find any pathology labs matching your search criteria. Please try with different search terms.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLabs.map((lab) => (
                <Card key={lab.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-12 w-12 mr-4 border-2 border-white">
                            {lab.image_url ? (
                              <AvatarImage src={lab.image_url} alt={lab.name} />
                            ) : null}
                            <AvatarFallback className="bg-purple-200 text-purple-700 dark:bg-purple-700 dark:text-purple-100 text-lg">
                              {lab.name[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{lab.name}</h3>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              <span>{lab.city}, {lab.state}</span>
                            </div>
                          </div>
                        </div>
                        {lab.rating && (
                          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100 hover:bg-purple-200 dark:hover:bg-purple-700">
                            {lab.rating.toFixed(1)} ★
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="mb-4">
                        <div className="flex items-start mb-2">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{lab.address}</span>
                        </div>
                        <div className="flex items-center mb-2">
                          <Phone className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{lab.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{lab.opening_hours}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Popular Tests:</h4>
                        <div className="flex flex-wrap gap-2">
                          {lab.tests_offered.slice(0, 3).map((test, index) => (
                            <Badge key={index} variant="outline" className="bg-gray-100 dark:bg-gray-700">
                              {test}
                            </Badge>
                          ))}
                          {lab.tests_offered.length > 3 && (
                            <Badge variant="outline" className="bg-gray-100 dark:bg-gray-700">
                              +{lab.tests_offered.length - 3} more
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

export default LabsPage;
