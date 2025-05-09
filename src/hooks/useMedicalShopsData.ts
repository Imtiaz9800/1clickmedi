
import { useState, useEffect } from "react";
import { MedicalShop } from "@/types/medical-shop";
import { MedicalShopFormData } from "@/components/admin/forms/MedicalShopForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useMedicalShopsData() {
  const { toast } = useToast();
  const [shops, setShops] = useState<MedicalShop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // CRUD operations for medical shops
  const addMedicalShop = async (data: MedicalShopFormData) => {
    try {
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

      return true;
    } catch (error) {
      console.error("Error adding medical shop:", error);
      toast({
        title: "Failed to add medical shop",
        description: "An error occurred while adding the medical shop data.",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateMedicalShop = async (id: string, data: MedicalShopFormData) => {
    try {
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
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setShops(shops.map(shop => 
        shop.id === id 
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

      return true;
    } catch (error) {
      console.error("Error updating medical shop:", error);
      toast({
        title: "Failed to update medical shop",
        description: "An error occurred while updating the medical shop data.",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteMedicalShop = async (shop: MedicalShop) => {
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
      return true;
    } catch (error) {
      console.error("Error deleting shop:", error);
      toast({
        title: "Failed to remove medical shop",
        description: "An error occurred while trying to delete the medical shop.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchMedicalShops();
  }, []);

  return {
    shops,
    isLoading,
    addMedicalShop,
    updateMedicalShop,
    deleteMedicalShop
  };
}
