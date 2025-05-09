
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDataTable from "@/components/admin/shared/AdminDataTable";
import { useMedicalShopsData } from "@/hooks/useMedicalShopsData";
import { getMedicalShopColumns } from "@/components/admin/tables/MedicalShopColumns";
import MedicalShopDialog from "@/components/admin/dialogs/MedicalShopDialog";
import { MedicalShopFormData } from "@/components/admin/forms/MedicalShopForm";
import { MedicalShop } from "@/types/medical-shop";
import { useToast } from "@/hooks/use-toast";

const MedicalShopManagement = () => {
  const { toast } = useToast();
  const { shops, isLoading, addMedicalShop, updateMedicalShop, deleteMedicalShop } = useMedicalShopsData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentShop, setCurrentShop] = useState<MedicalShop | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);

  const columns = getMedicalShopColumns();

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

  const handleFormSubmit = async (data: MedicalShopFormData) => {
    try {
      let success;
      
      if (isEditing && currentShop) {
        success = await updateMedicalShop(currentShop.id, data);
      } else {
        success = await addMedicalShop(data);
      }
      
      if (success) {
        setIsDialogOpen(false);
        toast({
          title: `Medical shop ${isEditing ? "updated" : "added"} successfully`,
          description: `${data.name} has been ${isEditing ? "updated" : "added"} to the database.`,
        });
      }
    } catch (error) {
      console.error("Error saving medical shop:", error);
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
        onDelete={deleteMedicalShop}
        isLoading={isLoading}
      />

      <MedicalShopDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        currentShop={currentShop}
        isEditing={isEditing}
        onSubmit={handleFormSubmit}
      />
    </AdminLayout>
  );
};

export default MedicalShopManagement;
