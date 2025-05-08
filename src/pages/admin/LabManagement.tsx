
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDataTable, { DataColumn } from "@/components/admin/shared/AdminDataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LabForm, { LabFormData } from "@/components/admin/forms/LabForm";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentLab, setCurrentLab] = useState<Lab | undefined>(undefined);
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
      key: "tests",
      label: "Tests",
      render: (tests) => (
        <div className="flex gap-2 flex-wrap">
          {tests.map((test: string, index: number) => (
            <span 
              key={index}
              className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full dark:bg-purple-800 dark:text-purple-100"
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
          <span className="ml-1 text-gray-900 dark:text-gray-100">{rating}</span>
        </div>
      ),
    },
  ];

  const handleAddLab = () => {
    setCurrentLab(undefined);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditLab = (lab: Lab) => {
    setCurrentLab(lab);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteLab = (lab: Lab) => {
    setLabs(labs.filter(item => item.id !== lab.id));
    toast({
      title: "Lab removed",
      description: `${lab.name} has been removed from the database.`,
    });
  };

  const handleFormSubmit = (data: LabFormData) => {
    if (isEditing && currentLab) {
      // Update existing lab
      setLabs(labs.map(lab => 
        lab.id === currentLab.id 
          ? {
              ...lab,
              name: data.name,
              location: data.location,
              contact: {
                phone: data.phone,
                email: data.email
              },
              tests: data.tests,
              rating: data.rating
            } 
          : lab
      ));
    } else {
      // Add new lab
      const newLab: Lab = {
        id: `${labs.length + 1}`,
        name: data.name,
        location: data.location,
        contact: {
          phone: data.phone,
          email: data.email
        },
        tests: data.tests,
        rating: data.rating
      };
      
      setLabs([...labs, newLab]);
    }
    
    setIsDialogOpen(false);
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Lab" : "Add New Lab"}
            </DialogTitle>
          </DialogHeader>
          <LabForm
            initialData={
              currentLab
                ? {
                    id: currentLab.id,
                    name: currentLab.name,
                    location: currentLab.location,
                    phone: currentLab.contact.phone,
                    email: currentLab.contact.email,
                    tests: currentLab.tests,
                    rating: currentLab.rating
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

export default LabManagement;
