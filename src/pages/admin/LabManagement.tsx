
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDataTable, { DataColumn } from "@/components/admin/shared/AdminDataTable";

interface Lab {
  id: string;
  name: string;
  location: string;
  contact: {
    phone: string;
    email: string;
  };
  tests: string[];
  rating: number;
}

const LabManagement = () => {
  // Sample data - would typically come from an API
  const [labs, setLabs] = useState<Lab[]>([
    {
      id: "1",
      name: "Apollo Diagnostics",
      location: "Chennai, Tamil Nadu",
      contact: {
        phone: "+91-9876543224",
        email: "apollodiag@example.com"
      },
      tests: ["Blood Tests", "Cardiac Risk Assessment"],
      rating: 4.5
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
      key: "tests",
      label: "Tests",
      render: (tests) => (
        <div className="flex gap-2 flex-wrap">
          {tests.map((test: string, index: number) => (
            <span 
              key={index}
              className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full dark:bg-purple-900 dark:text-purple-200"
            >
              {test}
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

  const handleAddLab = () => {
    console.log("Add lab");
  };

  const handleEditLab = (lab: Lab) => {
    console.log("Edit lab", lab);
  };

  const handleDeleteLab = (lab: Lab) => {
    console.log("Delete lab", lab);
  };

  return (
    <AdminLayout title="Pathology Lab Management">
      <AdminDataTable
        title="Labs"
        description="Add, edit, or remove pathology labs from the database."
        addButtonText="Add Pathology Lab"
        addButtonColor="bg-purple-600 hover:bg-purple-700"
        data={labs}
        columns={columns}
        onAdd={handleAddLab}
        onEdit={handleEditLab}
        onDelete={handleDeleteLab}
      />
    </AdminLayout>
  );
};

export default LabManagement;
