
export interface MedicalShop {
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
