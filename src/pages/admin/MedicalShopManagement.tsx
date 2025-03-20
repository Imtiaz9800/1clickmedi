
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { ChevronLeft, Trash2, Edit, Plus, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

const MedicalShopManagement: React.FC = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [shops, setShops] = useState<MedicalShop[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredShops, setFilteredShops] = useState<MedicalShop[]>([]);
  
  // Form state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<MedicalShop, 'id'>>({
    name: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    opening_hours: '',
    services: [],
    image_url: null,
    rating: null
  });
  const [servicesInput, setServicesInput] = useState('');
  
  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shopToDelete, setShopToDelete] = useState<string | null>(null);

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
        await fetchMedicalShops();
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
      setFilteredShops(shops);
    } else {
      const filtered = shops.filter(
        (shop) =>
          shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shop.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shop.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredShops(filtered);
    }
  }, [searchQuery, shops]);

  const fetchMedicalShops = async () => {
    try {
      const { data, error } = await supabase
        .from('medical_shops')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setShops(data || []);
      setFilteredShops(data || []);
    } catch (error) {
      console.error("Error fetching medical shops:", error);
      toast({
        title: "Error",
        description: "Failed to load medical shops",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServicesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServicesInput(e.target.value);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      state: '',
      phone: '',
      email: '',
      opening_hours: '',
      services: [],
      image_url: null,
      rating: null
    });
    setServicesInput('');
  };

  const handleAddShop = async () => {
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

      // Process services from comma-separated string to array
      const services = servicesInput
        .split(',')
        .map(service => service.trim())
        .filter(service => service !== '');

      const shopData = {
        ...formData,
        services
      };

      const { data, error } = await supabase
        .from('medical_shops')
        .insert([shopData])
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Medical shop added successfully",
      });

      // Close dialog and reset form
      setIsAddDialogOpen(false);
      resetForm();
      
      // Refresh the shops list
      await fetchMedicalShops();
    } catch (error) {
      console.error("Error adding medical shop:", error);
      toast({
        title: "Error",
        description: "Failed to add medical shop",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = (id: string) => {
    setShopToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteShop = async () => {
    if (!shopToDelete) return;
    
    try {
      const { error } = await supabase
        .from('medical_shops')
        .delete()
        .eq('id', shopToDelete);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Medical shop deleted successfully",
      });

      // Close dialog
      setDeleteDialogOpen(false);
      setShopToDelete(null);
      
      // Refresh the shops list
      await fetchMedicalShops();
    } catch (error) {
      console.error("Error deleting medical shop:", error);
      toast({
        title: "Error",
        description: "Failed to delete medical shop",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
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
                Medical Shop Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Add, edit, or remove medical shops from the database
              </p>
            </div>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="mt-4 md:mt-0 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Medical Shop
            </Button>
          </div>

          <Card className="bg-white dark:bg-gray-800 mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Medical Shops</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search shops by name, city, or email..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {filteredShops.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-300">
                    No medical shops found. Add a new shop to get started.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Opening Hours</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredShops.map((shop) => (
                        <TableRow key={shop.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                {shop.image_url ? (
                                  <AvatarImage src={shop.image_url} alt={shop.name} />
                                ) : null}
                                <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100 text-xs">
                                  {shop.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span>{shop.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{shop.city}, {shop.state}</TableCell>
                          <TableCell>{shop.email}</TableCell>
                          <TableCell>{shop.phone}</TableCell>
                          <TableCell>{shop.opening_hours}</TableCell>
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
                                onClick={() => confirmDelete(shop.id)}
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

      {/* Add Medical Shop Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Medical Shop</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Medical shop name"
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
                  placeholder="shop@example.com"
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
                <Label htmlFor="opening_hours">Opening Hours *</Label>
                <Input 
                  id="opening_hours" 
                  name="opening_hours" 
                  value={formData.opening_hours} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Mon-Sat: 9 AM - 9 PM"
                />
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
                <Label htmlFor="services">Services * (comma-separated)</Label>
                <Input 
                  id="services" 
                  value={servicesInput} 
                  onChange={handleServicesChange} 
                  placeholder="e.g. Prescription Medicines, OTC Drugs, Medical Equipment"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple services with commas</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddShop} className="bg-emerald-600 hover:bg-emerald-700">Add Medical Shop</Button>
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
              Are you sure you want to delete this medical shop? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteShop}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicalShopManagement;
