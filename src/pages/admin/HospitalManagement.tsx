
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Pencil, Trash2, Plus, Star, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    email: "",
    specialties: "",
    facilities: "",
    emergency_services: false,
    beds: "",
    rating: 0,
  });

  const queryClient = useQueryClient();

  // Fetch hospitals
  const { data: hospitals, isLoading } = useQuery({
    queryKey: ["hospitals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hospitals")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Hospital[];
    },
  });

  // Add new hospital
  const addMutation = useMutation({
    mutationFn: async (newHospital: Omit<Hospital, "id" | "image_url">) => {
      const { data, error } = await supabase
        .from("hospitals")
        .insert([newHospital])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hospitals"] });
      toast({
        title: "Success",
        description: "Hospital added successfully",
      });
      setIsAddDialogOpen(false);
      resetFormData();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add hospital: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update hospital
  const updateMutation = useMutation({
    mutationFn: async (updatedHospital: Partial<Hospital>) => {
      const { id, ...hospitalData } = updatedHospital;
      const { data, error } = await supabase
        .from("hospitals")
        .update(hospitalData)
        .eq("id", id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hospitals"] });
      toast({
        title: "Success",
        description: "Hospital updated successfully",
      });
      setIsEditDialogOpen(false);
      setSelectedHospital(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update hospital: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete hospital
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("hospitals")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hospitals"] });
      toast({
        title: "Success",
        description: "Hospital deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete hospital: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      emergency_services: checked,
    });
  };

  const resetFormData = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      state: "",
      phone: "",
      email: "",
      specialties: "",
      facilities: "",
      emergency_services: false,
      beds: "",
      rating: 0,
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const specialties = formData.specialties
      .split(",")
      .map((specialty) => specialty.trim())
      .filter((specialty) => specialty.length > 0);

    const facilities = formData.facilities
      .split(",")
      .map((facility) => facility.trim())
      .filter((facility) => facility.length > 0);

    addMutation.mutate({
      name: formData.name,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      phone: formData.phone,
      email: formData.email,
      specialties,
      facilities,
      emergency_services: formData.emergency_services,
      beds: formData.beds ? parseInt(formData.beds) : null,
      rating: parseFloat(formData.rating.toString()) || null,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHospital) return;

    const specialties = formData.specialties
      .split(",")
      .map((specialty) => specialty.trim())
      .filter((specialty) => specialty.length > 0);

    const facilities = formData.facilities
      .split(",")
      .map((facility) => facility.trim())
      .filter((facility) => facility.length > 0);

    updateMutation.mutate({
      id: selectedHospital.id,
      name: formData.name,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      phone: formData.phone,
      email: formData.email,
      specialties,
      facilities,
      emergency_services: formData.emergency_services,
      beds: formData.beds ? parseInt(formData.beds) : null,
      rating: parseFloat(formData.rating.toString()) || null,
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const openEditDialog = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setFormData({
      name: hospital.name,
      address: hospital.address,
      city: hospital.city,
      state: hospital.state,
      phone: hospital.phone,
      email: hospital.email,
      specialties: hospital.specialties.join(", "),
      facilities: hospital.facilities.join(", "),
      emergency_services: hospital.emergency_services,
      beds: hospital.beds ? hospital.beds.toString() : "",
      rating: hospital.rating || 0,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hospital Management</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Add, edit, or remove hospitals from the database.</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <Plus className="h-4 w-4 mr-2" /> Add Hospital
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Hospital</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="beds">Beds</Label>
                    <Input
                      id="beds"
                      name="beds"
                      type="number"
                      min="0"
                      value={formData.beds}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating (0-5)</Label>
                    <Input
                      id="rating"
                      name="rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2 flex items-end">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="emergency_services"
                        checked={formData.emergency_services}
                        onCheckedChange={handleSwitchChange}
                      />
                      <Label htmlFor="emergency_services">Emergency Services</Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialties">Specialties (comma-separated)</Label>
                  <Textarea
                    id="specialties"
                    name="specialties"
                    value={formData.specialties}
                    onChange={handleInputChange}
                    placeholder="Cardiology, Neurology, Orthopedics, etc."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facilities">Facilities (comma-separated)</Label>
                  <Textarea
                    id="facilities"
                    name="facilities"
                    value={formData.facilities}
                    onChange={handleInputChange}
                    placeholder="MRI, CT Scan, ICU, NICU, etc."
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="h-32 bg-gray-100 dark:bg-gray-800 mt-6"></CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Specialties</TableHead>
                  <TableHead>Beds & Emergency</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hospitals?.map((hospital) => (
                  <TableRow key={hospital.id}>
                    <TableCell className="font-medium">{hospital.name}</TableCell>
                    <TableCell>{hospital.city}, {hospital.state}</TableCell>
                    <TableCell>
                      <div>{hospital.phone}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{hospital.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {hospital.specialties.slice(0, 2).map((specialty, index) => (
                          <Badge key={index} variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300">
                            {specialty}
                          </Badge>
                        ))}
                        {hospital.specialties.length > 2 && (
                          <Badge variant="outline" className="bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                            +{hospital.specialties.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{hospital.beds || "N/A"} beds</span>
                        <Badge variant={hospital.emergency_services ? "default" : "outline"} className={`w-fit mt-1 ${hospital.emergency_services ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "text-gray-600 dark:text-gray-400"}`}>
                          {hospital.emergency_services ? "Emergency Available" : "No Emergency"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>{hospital.rating?.toFixed(1) || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(hospital)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the hospital "{hospital.name}". This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(hospital.id)}
                                className="bg-red-500 hover:bg-red-600 text-white"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Hospital</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-beds">Beds</Label>
                <Input
                  id="edit-beds"
                  name="beds"
                  type="number"
                  min="0"
                  value={formData.beds}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-city">City</Label>
                <Input
                  id="edit-city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-state">State</Label>
                <Input
                  id="edit-state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-rating">Rating (0-5)</Label>
                <Input
                  id="edit-rating"
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2 flex items-end">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-emergency_services"
                    checked={formData.emergency_services}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="edit-emergency_services">Emergency Services</Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Textarea
                id="edit-address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-specialties">Specialties (comma-separated)</Label>
              <Textarea
                id="edit-specialties"
                name="specialties"
                value={formData.specialties}
                onChange={handleInputChange}
                placeholder="Cardiology, Neurology, Orthopedics, etc."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-facilities">Facilities (comma-separated)</Label>
              <Textarea
                id="edit-facilities"
                name="facilities"
                value={formData.facilities}
                onChange={handleInputChange}
                placeholder="MRI, CT Scan, ICU, NICU, etc."
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HospitalManagement;
