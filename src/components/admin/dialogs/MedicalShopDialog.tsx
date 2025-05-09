
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import MedicalShopForm, { MedicalShopFormData } from "@/components/admin/forms/MedicalShopForm";
import { MedicalShop } from "@/types/medical-shop";

interface MedicalShopDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentShop?: MedicalShop;
  isEditing: boolean;
  onSubmit: (data: MedicalShopFormData) => void;
}

const MedicalShopDialog: React.FC<MedicalShopDialogProps> = ({
  isOpen,
  onClose,
  currentShop,
  isEditing,
  onSubmit,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalShopDialog;
