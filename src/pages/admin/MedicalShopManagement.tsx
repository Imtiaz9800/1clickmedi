import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDataTable, { DataColumn } from "@/components/admin/shared/AdminDataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import MedicalShopForm, { MedicalShopFormData } from "@/components/admin/forms/MedicalShopForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MedicalShop {
  id: string;
  name: string;
  location: string;
  contact: {
    phone: string;
    email: string;
  };
  services: string[];
  rating: number;
  address?: string;
  city?: string;
  state?: string;
  opening_hours?: string;
}

const MedicalShopManagement = () => {
  const { toast } = useToast();
  const [shops, setShops] = useState<MedicalShop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentShop, setCurrentShop] = useState<MedicalShop | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchMedicalShops();
  }, []);

  const fetchMedicalShops = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('medical_shops')
        .select('*')
        .order('name');
        
      if (error) {
        throw error;
      }
      
      if (data) {
        const formattedShops = data.map(shop => ({
          id: shop.id,
          name: shop.name,
          location: shop.city + ', ' + shop.state,
          contact: {
            phone: shop.phone,
            email: shop.email
          },
          services: shop.services,
          rating: shop.rating || 0,
          address: shop.address,
          city: shop.city,
          state: shop.state,
          opening_hours: shop.opening_hours
        }));
        
        setShops(formattedShops);
      }
    } catch (error) {
      console.error("Error fetching medical shops:", error);
      toast({
        title: "Failed to load medical shops",
        description: "There was an error loading the medical shops data. Using demo data instead.",
        variant: "destructive",
      });
      
      // Set demo data
      setShops([
        {
          id: "1",
          name: "MedPlus Pharmacy",
          location: "Mumbai, Maharashtra",
          contact: {
            phone: "+91-9876543225",
            email: "medplus@example.com"
          },
          services: ["24/7 Service", "Home Delivery"],
          rating: 4.7,
          address: "123 Health St",
          city: "Mumbai",
          state: "Maharashtra",
          opening_hours: "24/7"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: DataColumn[] = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "location",
      label: "Location",
    },
    {
      key: "contact",
      label: "Contact",
      render: (contact) => (
        <div>
          <div className="text-gray-900 dark:text-gray-100">{contact.phone}</div>
          <div className="text-gray-500 dark:text-gray-300 text-xs">{contact.email}</div>
        </div>
      ),
    },
    {
      key: "services",
      label: "Services",
      render: (services) => (
        <div className="flex gap-2 flex-wrap">
          {services.map((service: string, index: number) => (
            <span 
              key={index}
              className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full dark:bg-green-800 dark:text-green-100"
            >
              {service}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      render: (rating) => (
        <div className="flex items-center">
          <span className="text-yellow-500">★</span>
          <span className="ml-1 text-gray-900 dark:text-gray-100">{rating}</span>
        </div>
      ),
    },
  ];

  const handleAddShop = () => {
    setCurrentShop(undefined);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditShop = (shop: MedicalShop) => {
    setCurrentShop(shop);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteShop = async (shop: MedicalShop) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('medical_shops')
        .delete()
        .eq('id', shop.id);
        
      if (error) throw error;
      
      // Update local state
      setShops(shops.filter(item => item.id !== shop.id));
      
      toast({
        title: "Medical shop removed",
        description: `${shop.name} has been removed from the database.`,
      });
    } catch (error) {
      console.error("Error deleting shop:", error);
      toast({
        title: "Failed to remove medical shop",
        description: "An error occurred while trying to delete the medical shop.",
        variant: "destructive"
      });
    }
  };

  const handleFormSubmit = async (data: MedicalShopFormData) => {
    try {
      if (isEditing && currentShop) {
        // Update existing shop in Supabase
        const { error } = await supabase
          .from('medical_shops')
          .update({
            name: data.name,
            address: data.address,
            city: data.city,
            state: data.state,
            phone: data.phone,
            email: data.email,
            opening_hours: data.opening_hours,
            services: data.services,
            rating: data.rating
          })
          .eq('id', currentShop.id);
          
        if (error) throw error;
        
        // Update local state
        setShops(shops.map(shop => 
          shop.id === currentShop.id 
            ? {
                ...shop,
                name: data.name,
                location: `${data.city}, ${data.state}`,
                contact: {
                  phone: data.phone,
                  email: data.email
                },
                services: data.services,
                rating: data.rating,
                address: data.address,
                city: data.city,
                state: data.state,
                opening_hours: data.opening_hours
              } 
            : shop
        ));
      } else {
        // Add new shop to Supabase
        const { data: newShop, error } = await supabase
          .from('medical_shops')
          .insert({
            name: data.name,
            address: data.address,
            city: data.city,
            state: data.state,
            phone: data.phone,
            email: data.email,
            opening_hours: data.opening_hours,
            services: data.services,
            rating: data.rating
          })
          .select();
          
        if (error) throw error;
        
        if (newShop && newShop.length > 0) {
          // Add new shop to local state
          const formattedShop: MedicalShop = {
            id: newShop[0].id,
            name: data.name,
            location: `${data.city}, ${data.state}`,
            contact: {
              phone: data.phone,
              email: data.email
            },
            services: data.services,
            rating: data.rating,
            address: data.address,
            city: data.city,
            state: data.state,
            opening_hours: data.opening_hours
          };
          
          setShops([...shops, formattedShop]);
        }
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving medical shop:", error);
      toast({
        title: `Failed to ${isEditing ? 'update' : 'add'} medical shop`,
        description: "An error occurred while saving the medical shop data.",
        variant: "destructive"
      });
    }
  };

  return (
    <AdminLayout title="Medical Shop Management">
      <AdminDataTable
        title="Medical Shops"
        description="Add, edit, or remove medical shops from the database."
        addButtonText="Add Medical Shop"
        addButtonColor="bg-green-600 hover:bg-green-700"
        data={shops}
        columns={columns}
        onAdd={handleAddShop}
        onEdit={handleEditShop}
        onDelete={handleDeleteShop}
        isLoading={isLoading}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent 
          className="w-[90vw] max-w-[800px] h-auto max-h-[90vh] p-0 bg-card text-card-foreground" 
          onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-bold text-foreground">
              {isEditing ? "Edit Medical Shop" : "Add New Medical Shop"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {isEditing ? "Edit the details of this medical shop." : "Add a new medical shop to the database."}
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-3 overflow-y-auto max-h-[calc(90vh-120px)]">
            <MedicalShopForm
              initialData={
                currentShop
                  ? {
                      id: currentShop.id,
                      name: currentShop.name,
                      location: currentShop.location,
                      phone: currentShop.contact.phone,
                      email: currentShop.contact.email,
                      services: currentShop.services,
                      rating: currentShop.rating,
                      address: currentShop.address,
                      city: currentShop.city,
                      state: currentShop.state,
                      opening_hours: currentShop.opening_hours
                    }
                  : undefined
              }
              onSubmit={handleFormSubmit}
              onCancel={() => setIsDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default MedicalShopManagement;
