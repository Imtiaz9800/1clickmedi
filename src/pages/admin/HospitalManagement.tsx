
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { ChevronLeft, Trash2, Edit, Plus, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
  rating: number | null;
}

const HospitalManagement: React.FC = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  
  // Form state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Hospital, 'id'>>({
    name: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    specialties: [],
    facilities: [],
    emergency_services: false,
    beds: null,
    image_url: null,
    rating: null
  });
  const [specialtiesInput, setSpecialtiesInput] = useState('');
  const [facilitiesInput, setFacilitiesInput] = useState('');
  
  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [hospitalToDelete, setHospitalToDelete] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsLoading(true);
        const { data: session } = await supabase.auth.getSession();
        
        if (!session.session) {
          navigate('/');
          toast({
            title: "Access Denied",
            description: "You need to login to access the admin dashboard",
            variant: "destructive",
          });
          return;
        }

        // Check if user is admin
        const { data: user } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.session.user.id)
          .single();

        if (!user || user.role !== 'admin') {
          navigate('/');
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page",
            variant: "destructive",
          });
          return;
        }

        setIsAdmin(true);
        await fetchHospitals();
      } catch (error) {
        console.error("Error checking admin status:", error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredHospitals(hospitals);
    } else {
      const filtered = hospitals.filter(
        (hospital) =>
          hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hospital.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hospital.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hospital.specialties.some(specialty => 
            specialty.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
      setFilteredHospitals(filtered);
    }
  }, [searchQuery, hospitals]);

  const fetchHospitals = async () => {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setHospitals(data || []);
      setFilteredHospitals(data || []);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      toast({
        title: "Error",
        description: "Failed to load hospitals",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'beds') {
      // Handle beds as number or null
      const bedsValue = value === '' ? null : parseInt(value);
      setFormData(prev => ({
        ...prev,
        [name]: bedsValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSpecialtiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpecialtiesInput(e.target.value);
  };

  const handleFacilitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFacilitiesInput(e.target.value);
  };

  const handleEmergencyServicesChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      emergency_services: checked
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      state: '',
      phone: '',
      email: '',
      specialties: [],
      facilities: [],
      emergency_services: false,
      beds: null,
      image_url: null,
      rating: null
    });
    setSpecialtiesInput('');
    setFacilitiesInput('');
  };

  const handleAddHospital = async () => {
    try {
      // Validate form data
      if (!formData.name || !formData.address || !formData.city || !formData.email || !formData.phone) {
        toast({
          title: "Missing Fields",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Process specialties and facilities from comma-separated strings to arrays
      const specialties = specialtiesInput
        .split(',')
        .map(specialty => specialty.trim())
        .filter(specialty => specialty !== '');

      const facilities = facilitiesInput
        .split(',')
        .map(facility => facility.trim())
        .filter(facility => facility !== '');

      const hospitalData = {
        ...formData,
        specialties,
        facilities
      };

      const { data, error } = await supabase
        .from('hospitals')
        .insert([hospitalData])
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Hospital added successfully",
      });

      // Close dialog and reset form
      setIsAddDialogOpen(false);
      resetForm();
      
      // Refresh the hospitals list
      await fetchHospitals();
    } catch (error) {
      console.error("Error adding hospital:", error);
      toast({
        title: "Error",
        description: "Failed to add hospital",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = (id: string) => {
    setHospitalToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteHospital = async () => {
    if (!hospitalToDelete) return;
    
    try {
      const { error } = await supabase
        .from('hospitals')
        .delete()
        .eq('id', hospitalToDelete);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Hospital deleted successfully",
      });

      // Close dialog
      setDeleteDialogOpen(false);
      setHospitalToDelete(null);
      
      // Refresh the hospitals list
      await fetchHospitals();
    } catch (error) {
      console.error("Error deleting hospital:", error);
      toast({
        title: "Error",
        description: "Failed to delete hospital",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // This will be redirected by the useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to="/admin" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center">
                <ChevronLeft className="h-5 w-5 mr-1" />
                Back to Dashboard
              </Link>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm">
                Back to Site
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Hospital Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Add, edit, or remove hospitals from the database
              </p>
            </div>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Hospital
            </Button>
          </div>

          <Card className="bg-white dark:bg-gray-800 mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Hospitals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search by name, location, or specialty..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {filteredHospitals.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-300">
                    No hospitals found. Add a new hospital to get started.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Emergency</TableHead>
                        <TableHead>Beds</TableHead>
                        <TableHead>Specialties</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHospitals.map((hospital) => (
                        <TableRow key={hospital.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                {hospital.image_url ? (
                                  <AvatarImage src={hospital.image_url} alt={hospital.name} />
                                ) : null}
                                <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 text-xs">
                                  {hospital.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span>{hospital.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{hospital.city}, {hospital.state}</TableCell>
                          <TableCell>
                            {hospital.emergency_services ? (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                                Available
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-gray-500 dark:text-gray-400">
                                Unavailable
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{hospital.beds || '-'}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {hospital.specialties.slice(0, 2).map((specialty, index) => (
                                <Badge key={index} variant="outline" className="bg-gray-100 dark:bg-gray-700 text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                              {hospital.specialties.length > 2 && (
                                <Badge variant="outline" className="bg-gray-100 dark:bg-gray-700 text-xs">
                                  +{hospital.specialties.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-amber-500"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:hover:bg-red-950"
                                onClick={() => confirmDelete(hospital.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Add Hospital Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Hospital</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Hospital Name *</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Hospital name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  placeholder="hospital@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  placeholder="Contact number"
                />
              </div>
              <div>
                <Label htmlFor="beds">Number of Beds</Label>
                <Input 
                  id="beds" 
                  name="beds" 
                  type="number"
                  value={formData.beds === null ? '' : formData.beds} 
                  onChange={handleInputChange} 
                  placeholder="Total bed capacity"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="emergency_services"
                  checked={formData.emergency_services}
                  onCheckedChange={handleEmergencyServicesChange}
                />
                <Label htmlFor="emergency_services">Emergency Services Available</Label>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Address *</Label>
                <Input 
                  id="address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange} 
                  placeholder="Full address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input 
                    id="city" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input 
                    id="state" 
                    name="state" 
                    value={formData.state} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="specialties">Specialties * (comma-separated)</Label>
                <Input 
                  id="specialties" 
                  value={specialtiesInput} 
                  onChange={handleSpecialtiesChange} 
                  placeholder="e.g. Cardiology, Neurology, Orthopedics"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple specialties with commas</p>
              </div>
              <div>
                <Label htmlFor="facilities">Facilities * (comma-separated)</Label>
                <Input 
                  id="facilities" 
                  value={facilitiesInput} 
                  onChange={handleFacilitiesChange} 
                  placeholder="e.g. ICU, CT Scan, MRI, Blood Bank"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple facilities with commas</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddHospital} className="bg-blue-600 hover:bg-blue-700">Add Hospital</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this hospital? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteHospital}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HospitalManagement;
