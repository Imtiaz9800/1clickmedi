
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDataTable, { DataColumn } from "@/components/admin/shared/AdminDataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import MedicalShopForm, { MedicalShopFormData } from "@/components/admin/forms/MedicalShopForm";
import { useToast } from "@/hooks/use-toast";

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
}

const MedicalShopManagement = () => {
  const { toast } = useToast();
  const [shops, setShops] = useState<MedicalShop[]>([
    {
      id: "1",
      name: "MedPlus Pharmacy",
      location: "Mumbai, Maharashtra",
      contact: {
        phone: "+91-9876543225",
        email: "medplus@example.com"
      },
      services: ["24/7 Service", "Home Delivery"],
      rating: 4.7
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentShop, setCurrentShop] = useState<MedicalShop | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleDeleteShop = (shop: MedicalShop) => {
    setShops(shops.filter(item => item.id !== shop.id));
    toast({
      title: "Medical shop removed",
      description: `${shop.name} has been removed from the database.`,
    });
  };

  const handleFormSubmit = (data: MedicalShopFormData) => {
    if (isEditing && currentShop) {
      // Update existing shop
      setShops(shops.map(shop => 
        shop.id === currentShop.id 
          ? {
              ...shop,
              name: data.name,
              location: data.location,
              contact: {
                phone: data.phone,
                email: data.email
              },
              services: data.services,
              rating: data.rating
            } 
          : shop
      ));
    } else {
      // Add new shop
      const newShop: MedicalShop = {
        id: `${shops.length + 1}`,
        name: data.name,
        location: data.location,
        contact: {
          phone: data.phone,
          email: data.email
        },
        services: data.services,
        rating: data.rating
      };
      
      setShops([...shops, newShop]);
    }
    
    setIsDialogOpen(false);
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
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px] p-6 bg-card text-card-foreground">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl font-bold text-foreground">
              {isEditing ? "Edit Medical Shop" : "Add New Medical Shop"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {isEditing ? "Edit the details of this medical shop." : "Add a new medical shop to the database."}
            </DialogDescription>
          </DialogHeader>
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
                    rating: currentShop.rating
                  }
                : undefined
            }
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default MedicalShopManagement;
