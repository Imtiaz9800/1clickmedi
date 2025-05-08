
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDataTable, { DataColumn } from "@/components/admin/shared/AdminDataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import HospitalForm, { HospitalFormData } from "@/components/admin/forms/HospitalForm";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentHospital, setCurrentHospital] = useState<Hospital | undefined>(undefined);
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
      key: "specialties",
      label: "Specialties",
      render: (specialties) => (
        <div className="flex gap-2 flex-wrap">
          {specialties.map((specialty: string, index: number) => (
            <span 
              key={index}
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full dark:bg-blue-800 dark:text-blue-100"
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
          <span className="ml-1 text-gray-900 dark:text-gray-100">{rating}</span>
        </div>
      ),
    },
  ];

  const handleAddHospital = () => {
    setCurrentHospital(undefined);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditHospital = (hospital: Hospital) => {
    setCurrentHospital(hospital);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteHospital = (hospital: Hospital) => {
    setHospitals(hospitals.filter(item => item.id !== hospital.id));
    toast({
      title: "Hospital removed",
      description: `${hospital.name} has been removed from the database.`,
    });
  };

  const handleFormSubmit = (data: HospitalFormData) => {
    if (isEditing && currentHospital) {
      // Update existing hospital
      setHospitals(hospitals.map(hospital => 
        hospital.id === currentHospital.id 
          ? {
              ...hospital,
              name: data.name,
              location: data.location,
              contact: {
                phone: data.phone,
                email: data.email
              },
              specialties: data.specialties,
              rating: data.rating
            } 
          : hospital
      ));
    } else {
      // Add new hospital
      const newHospital: Hospital = {
        id: `${hospitals.length + 1}`,
        name: data.name,
        location: data.location,
        contact: {
          phone: data.phone,
          email: data.email
        },
        specialties: data.specialties,
        rating: data.rating
      };
      
      setHospitals([...hospitals, newHospital]);
    }
    
    setIsDialogOpen(false);
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Hospital" : "Add New Hospital"}
            </DialogTitle>
          </DialogHeader>
          <HospitalForm
            initialData={
              currentHospital
                ? {
                    id: currentHospital.id,
                    name: currentHospital.name,
                    location: currentHospital.location,
                    phone: currentHospital.contact.phone,
                    email: currentHospital.contact.email,
                    specialties: currentHospital.specialties,
                    rating: currentHospital.rating
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

export default HospitalManagement;
