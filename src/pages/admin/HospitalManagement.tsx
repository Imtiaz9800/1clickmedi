
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDataTable, { DataColumn } from "@/components/admin/shared/AdminDataTable";

interface Hospital {
  id: string;
  name: string;
  location: string;
  contact: {
    phone: string;
    email: string;
  };
  specialties: string[];
  rating: number;
}

const HospitalManagement = () => {
  // Sample data - would typically come from an API
  const [hospitals, setHospitals] = useState<Hospital[]>([
    {
      id: "1",
      name: "Apollo Hospitals",
      location: "Chennai, Tamil Nadu",
      contact: {
        phone: "+91-9876543226",
        email: "apollo@example.com"
      },
      specialties: ["Cardiology", "Neurology"],
      rating: 4.8
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
      key: "specialties",
      label: "Specialties",
      render: (specialties) => (
        <div className="flex gap-2 flex-wrap">
          {specialties.map((specialty: string, index: number) => (
            <span 
              key={index}
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200"
            >
              {specialty}
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

  const handleAddHospital = () => {
    console.log("Add hospital");
  };

  const handleEditHospital = (hospital: Hospital) => {
    console.log("Edit hospital", hospital);
  };

  const handleDeleteHospital = (hospital: Hospital) => {
    console.log("Delete hospital", hospital);
  };

  return (
    <AdminLayout title="Hospital Management">
      <AdminDataTable
        title="Hospitals"
        description="Add, edit, or remove hospitals from the database."
        addButtonText="Add Hospital"
        addButtonColor="bg-blue-600 hover:bg-blue-700"
        data={hospitals}
        columns={columns}
        onAdd={handleAddHospital}
        onEdit={handleEditHospital}
        onDelete={handleDeleteHospital}
      />
    </AdminLayout>
  );
};

export default HospitalManagement;
