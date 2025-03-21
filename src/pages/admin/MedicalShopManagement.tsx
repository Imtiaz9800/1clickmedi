
import React, { useState, useEffect } from "react";
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
import { toast } from "@/components/ui/use-toast";
import { Pencil, Trash2, Plus, Star, StoreIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<MedicalShop | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    email: "",
    opening_hours: "",
    services: "",
    rating: 0,
  });

  const queryClient = useQueryClient();

  // Fetch medical shops
  const { data: shops, isLoading } = useQuery({
    queryKey: ["medical-shops"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("medical_shops")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as MedicalShop[];
    },
  });

  // Add new medical shop
  const addMutation = useMutation({
    mutationFn: async (newShop: Omit<MedicalShop, "id" | "image_url">) => {
      const { data, error } = await supabase
        .from("medical_shops")
        .insert([newShop])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-shops"] });
      toast({
        title: "Success",
        description: "Medical shop added successfully",
      });
      setIsAddDialogOpen(false);
      resetFormData();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add medical shop: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update medical shop
  const updateMutation = useMutation({
    mutationFn: async (updatedShop: Partial<MedicalShop>) => {
      const { id, ...shopData } = updatedShop;
      const { data, error } = await supabase
        .from("medical_shops")
        .update(shopData)
        .eq("id", id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-shops"] });
      toast({
        title: "Success",
        description: "Medical shop updated successfully",
      });
      setIsEditDialogOpen(false);
      setSelectedShop(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update medical shop: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete medical shop
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("medical_shops")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-shops"] });
      toast({
        title: "Success",
        description: "Medical shop deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete medical shop: ${error.message}`,
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

  const resetFormData = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      state: "",
      phone: "",
      email: "",
      opening_hours: "",
      services: "",
      rating: 0,
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const services = formData.services
      .split(",")
      .map((service) => service.trim())
      .filter((service) => service.length > 0);

    addMutation.mutate({
      name: formData.name,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      phone: formData.phone,
      email: formData.email,
      opening_hours: formData.opening_hours,
      services,
      rating: parseFloat(formData.rating.toString()) || null,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShop) return;

    const services = formData.services
      .split(",")
      .map((service) => service.trim())
      .filter((service) => service.length > 0);

    updateMutation.mutate({
      id: selectedShop.id,
      name: formData.name,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      phone: formData.phone,
      email: formData.email,
      opening_hours: formData.opening_hours,
      services,
      rating: parseFloat(formData.rating.toString()) || null,
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const openEditDialog = (shop: MedicalShop) => {
    setSelectedShop(shop);
    setFormData({
      name: shop.name,
      address: shop.address,
      city: shop.city,
      state: shop.state,
      phone: shop.phone,
      email: shop.email,
      opening_hours: shop.opening_hours,
      services: shop.services.join(", "),
      rating: shop.rating || 0,
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Medical Shop Management</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Add, edit, or remove medical shops from the database.</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-medical-600 hover:bg-medical-700 text-white">
                <Plus className="h-4 w-4 mr-2" /> Add Medical Shop
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Medical Shop</DialogTitle>
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
                    <Label htmlFor="opening_hours">Opening Hours</Label>
                    <Input
                      id="opening_hours"
                      name="opening_hours"
                      value={formData.opening_hours}
                      onChange={handleInputChange}
                      required
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
                  <Label htmlFor="services">Services (comma-separated)</Label>
                  <Textarea
                    id="services"
                    name="services"
                    value={formData.services}
                    onChange={handleInputChange}
                    placeholder="Prescription Medicines, OTC Drugs, Health Supplements, etc."
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
                <CardHeader className="h-12 bg-gray-200 dark:bg-gray-700"></CardHeader>
                <CardContent className="h-32 bg-gray-100 dark:bg-gray-800"></CardContent>
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
                  <TableHead>Services</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shops?.map((shop) => (
                  <TableRow key={shop.id}>
                    <TableCell className="font-medium">{shop.name}</TableCell>
                    <TableCell>{shop.city}, {shop.state}</TableCell>
                    <TableCell>
                      <div>{shop.phone}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{shop.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {shop.services.slice(0, 2).map((service, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            {service}
                          </Badge>
                        ))}
                        {shop.services.length > 2 && (
                          <Badge variant="outline" className="bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                            +{shop.services.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>{shop.rating?.toFixed(1) || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(shop)}
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
                                This will permanently delete the medical shop "{shop.name}". This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(shop.id)}
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
            <DialogTitle>Edit Medical Shop</DialogTitle>
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
                <Label htmlFor="edit-opening_hours">Opening Hours</Label>
                <Input
                  id="edit-opening_hours"
                  name="opening_hours"
                  value={formData.opening_hours}
                  onChange={handleInputChange}
                  required
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
              <Label htmlFor="edit-services">Services (comma-separated)</Label>
              <Textarea
                id="edit-services"
                name="services"
                value={formData.services}
                onChange={handleInputChange}
                placeholder="Prescription Medicines, OTC Drugs, Health Supplements, etc."
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

export default MedicalShopManagement;
