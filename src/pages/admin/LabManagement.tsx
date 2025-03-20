
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

const LabManagement: React.FC = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [labs, setLabs] = useState<PathologyLab[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLabs, setFilteredLabs] = useState<PathologyLab[]>([]);
  
  // Form state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<PathologyLab, 'id'>>({
    name: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    opening_hours: '',
    tests_offered: [],
    image_url: null,
    rating: null
  });
  const [testsInput, setTestsInput] = useState('');
  
  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [labToDelete, setLabToDelete] = useState<string | null>(null);

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
        await fetchLabs();
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
      setFilteredLabs(labs);
    } else {
      const filtered = labs.filter(
        (lab) =>
          lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lab.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lab.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLabs(filtered);
    }
  }, [searchQuery, labs]);

  const fetchLabs = async () => {
    try {
      const { data, error } = await supabase
        .from('pathology_labs')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setLabs(data || []);
      setFilteredLabs(data || []);
    } catch (error) {
      console.error("Error fetching pathology labs:", error);
      toast({
        title: "Error",
        description: "Failed to load pathology labs",
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

  const handleTestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTestsInput(e.target.value);
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
      tests_offered: [],
      image_url: null,
      rating: null
    });
    setTestsInput('');
  };

  const handleAddLab = async () => {
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

      // Process tests from comma-separated string to array
      const tests_offered = testsInput
        .split(',')
        .map(test => test.trim())
        .filter(test => test !== '');

      const labData = {
        ...formData,
        tests_offered
      };

      const { data, error } = await supabase
        .from('pathology_labs')
        .insert([labData])
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pathology lab added successfully",
      });

      // Close dialog and reset form
      setIsAddDialogOpen(false);
      resetForm();
      
      // Refresh the labs list
      await fetchLabs();
    } catch (error) {
      console.error("Error adding pathology lab:", error);
      toast({
        title: "Error",
        description: "Failed to add pathology lab",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = (id: string) => {
    setLabToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteLab = async () => {
    if (!labToDelete) return;
    
    try {
      const { error } = await supabase
        .from('pathology_labs')
        .delete()
        .eq('id', labToDelete);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pathology lab deleted successfully",
      });

      // Close dialog
      setDeleteDialogOpen(false);
      setLabToDelete(null);
      
      // Refresh the labs list
      await fetchLabs();
    } catch (error) {
      console.error("Error deleting pathology lab:", error);
      toast({
        title: "Error",
        description: "Failed to delete pathology lab",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
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
                Pathology Lab Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Add, edit, or remove pathology labs from the database
              </p>
            </div>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="mt-4 md:mt-0 bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Pathology Lab
            </Button>
          </div>

          <Card className="bg-white dark:bg-gray-800 mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Pathology Labs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search labs by name, city, or email..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {filteredLabs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-300">
                    No pathology labs found. Add a new lab to get started.
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
                      {filteredLabs.map((lab) => (
                        <TableRow key={lab.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                {lab.image_url ? (
                                  <AvatarImage src={lab.image_url} alt={lab.name} />
                                ) : null}
                                <AvatarFallback className="bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100 text-xs">
                                  {lab.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span>{lab.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{lab.city}, {lab.state}</TableCell>
                          <TableCell>{lab.email}</TableCell>
                          <TableCell>{lab.phone}</TableCell>
                          <TableCell>{lab.opening_hours}</TableCell>
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
                                onClick={() => confirmDelete(lab.id)}
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

      {/* Add Pathology Lab Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Pathology Lab</DialogTitle>
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
                  placeholder="Pathology lab name"
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
                  placeholder="lab@example.com"
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
                  placeholder="e.g. Mon-Sat: 7 AM - 8 PM"
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
                <Label htmlFor="tests_offered">Tests Offered * (comma-separated)</Label>
                <Input 
                  id="tests_offered" 
                  value={testsInput} 
                  onChange={handleTestsChange} 
                  placeholder="e.g. CBC, Lipid Profile, Blood Sugar, Thyroid Test"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple tests with commas</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddLab} className="bg-purple-600 hover:bg-purple-700">Add Pathology Lab</Button>
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
              Are you sure you want to delete this pathology lab? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteLab}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabManagement;
