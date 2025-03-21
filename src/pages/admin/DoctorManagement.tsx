
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Trash2, Edit, Plus, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualifications: string;
  experience: number;
  bio: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  image_url: string | null;
  category_id: string | null;
  working_hours: string;
}

interface Category {
  id: string;
  name: string;
}

const DoctorManagement: React.FC = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  
  // Form state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Doctor, 'id'>>({
    name: '',
    specialty: '',
    qualifications: '',
    experience: 0,
    bio: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    image_url: null,
    category_id: null,
    working_hours: ''
  });
  
  // Edit state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editDoctorId, setEditDoctorId] = useState<string | null>(null);
  
  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsLoading(true);
        const { data: session } = await supabase.auth.getSession();
        
        if (!session.session) {
          navigate('/admin/login');
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
        await Promise.all([
          fetchDoctors(),
          fetchCategories()
        ]);
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
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
  }, [searchQuery, doctors]);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setDoctors(data || []);
      setFilteredDoctors(data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast({
        title: "Error",
        description: "Failed to load doctors",
        variant: "destructive",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experience' ? parseInt(value) || 0 : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      specialty: '',
      qualifications: '',
      experience: 0,
      bio: '',
      address: '',
      city: '',
      state: '',
      phone: '',
      email: '',
      image_url: null,
      category_id: null,
      working_hours: ''
    });
    setIsEditMode(false);
    setEditDoctorId(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (doctor: Doctor) => {
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      qualifications: doctor.qualifications,
      experience: doctor.experience,
      bio: doctor.bio,
      address: doctor.address,
      city: doctor.city,
      state: doctor.state,
      phone: doctor.phone,
      email: doctor.email,
      image_url: doctor.image_url,
      category_id: doctor.category_id,
      working_hours: doctor.working_hours
    });
    setIsEditMode(true);
    setEditDoctorId(doctor.id);
    setIsAddDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      // Validate form data
      if (!formData.name || !formData.specialty || !formData.email || !formData.phone) {
        toast({
          title: "Missing Fields",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      if (isEditMode && editDoctorId) {
        // Update existing doctor
        const { error } = await supabase
          .from('doctors')
          .update(formData)
          .eq('id', editDoctorId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Doctor updated successfully",
        });
      } else {
        // Add new doctor
        const { error } = await supabase
          .from('doctors')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Doctor added successfully",
        });
      }

      // Close dialog and reset form
      setIsAddDialogOpen(false);
      resetForm();
      
      // Refresh the doctors list
      await fetchDoctors();
    } catch (error) {
      console.error("Error saving doctor:", error);
      toast({
        title: "Error",
        description: isEditMode ? "Failed to update doctor" : "Failed to add doctor",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = (id: string) => {
    setDoctorToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDoctor = async () => {
    if (!doctorToDelete) return;
    
    try {
      const { error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', doctorToDelete);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Doctor deleted successfully",
      });

      // Close dialog
      setDeleteDialogOpen(false);
      setDoctorToDelete(null);
      
      // Refresh the doctors list
      await fetchDoctors();
    } catch (error) {
      console.error("Error deleting doctor:", error);
      toast({
        title: "Error",
        description: "Failed to delete doctor",
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
    <AdminLayout title="Doctor Management">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4 md:mb-0">
            Add, edit, or remove doctors from the database
          </p>
          <Button 
            onClick={openAddDialog}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Doctor
          </Button>
        </div>

        <Card className="bg-white dark:bg-gray-800 mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search doctors by name, specialty, or email..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {filteredDoctors.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-300">
                  No doctors found. Add a new doctor to get started.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Specialty</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead className="hidden lg:table-cell">Phone</TableHead>
                      <TableHead className="hidden lg:table-cell">Experience</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDoctors.map((doctor) => (
                      <TableRow key={doctor.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              {doctor.image_url ? (
                                <AvatarImage src={doctor.image_url} alt={doctor.name} />
                              ) : null}
                              <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 text-xs">
                                {doctor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span>{doctor.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{doctor.specialty}</TableCell>
                        <TableCell className="hidden md:table-cell">{doctor.email}</TableCell>
                        <TableCell className="hidden lg:table-cell">{doctor.phone}</TableCell>
                        <TableCell className="hidden lg:table-cell">{doctor.experience} years</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-amber-500"
                              onClick={() => openEditDialog(doctor)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:hover:bg-red-950"
                              onClick={() => confirmDelete(doctor.id)}
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

      {/* Add/Edit Doctor Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{isEditMode ? 'Edit Doctor' : 'Add New Doctor'}</DialogTitle>
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
                  placeholder="Doctor's full name"
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
                  placeholder="doctor@example.com"
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
                <Label htmlFor="specialty">Specialty *</Label>
                <Input 
                  id="specialty" 
                  name="specialty" 
                  value={formData.specialty} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Cardiologist, Pediatrician"
                />
              </div>
              <div>
                <Label htmlFor="category_id">Category</Label>
                <Select 
                  value={formData.category_id || ''} 
                  onValueChange={(value) => handleSelectChange('category_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="experience">Experience (years) *</Label>
                <Input 
                  id="experience" 
                  name="experience" 
                  type="number" 
                  value={formData.experience} 
                  onChange={handleInputChange} 
                  min="0"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="qualifications">Qualifications *</Label>
                <Input 
                  id="qualifications" 
                  name="qualifications" 
                  value={formData.qualifications} 
                  onChange={handleInputChange} 
                  placeholder="e.g. MBBS, MD, MS"
                />
              </div>
              <div>
                <Label htmlFor="address">Address *</Label>
                <Input 
                  id="address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange} 
                  placeholder="Clinic/Hospital address"
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
                <Label htmlFor="working_hours">Working Hours *</Label>
                <Input 
                  id="working_hours" 
                  name="working_hours" 
                  value={formData.working_hours} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Mon-Fri: 9 AM - 5 PM"
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio/Description *</Label>
                <Textarea 
                  id="bio" 
                  name="bio" 
                  value={formData.bio} 
                  onChange={handleInputChange} 
                  placeholder="Brief description about the doctor"
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>
              {isEditMode ? 'Update Doctor' : 'Add Doctor'}
            </Button>
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
              Are you sure you want to delete this doctor? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteDoctor}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default DoctorManagement;
