
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDataTable, { DataColumn } from "@/components/admin/shared/AdminDataTable";

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
  // Sample data - would typically come from an API
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
          <div className="text-gray-900 dark:text-white">{contact.phone}</div>
          <div className="text-gray-500 dark:text-gray-400 text-xs">{contact.email}</div>
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
              className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full dark:bg-green-900 dark:text-green-200"
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
          <span className="ml-1 text-gray-900 dark:text-white">{rating}</span>
        </div>
      ),
    },
  ];

  const handleAddShop = () => {
    console.log("Add medical shop");
  };

  const handleEditShop = (shop: MedicalShop) => {
    console.log("Edit medical shop", shop);
  };

  const handleDeleteShop = (shop: MedicalShop) => {
    console.log("Delete medical shop", shop);
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
    </AdminLayout>
  );
};

export default MedicalShopManagement;
