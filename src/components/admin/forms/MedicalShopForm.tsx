
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export interface MedicalShopFormData {
  id?: string;
  name: string;
  location: string;
  phone: string;
  email: string;
  services: string[];
  rating: number;
  address?: string;
  city?: string;
  state?: string;
  opening_hours?: string;
}

interface MedicalShopFormProps {
  initialData?: MedicalShopFormData;
  onSubmit: (data: MedicalShopFormData) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  services: z.string().min(1, "Services are required"),
  rating: z.coerce.number().min(0).max(5),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  opening_hours: z.string().min(1, "Opening hours are required"),
});

export const MedicalShopForm: React.FC<MedicalShopFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          location: initialData.location,
          phone: initialData.phone,
          email: initialData.email,
          services: initialData.services?.join(", ") || "",
          rating: initialData.rating || 4,
          address: initialData.address || "",
          city: initialData.city || "",
          state: initialData.state || "",
          opening_hours: initialData.opening_hours || "",
        }
      : {
          name: "",
          location: "",
          phone: "",
          email: "",
          services: "",
          rating: 4,
          address: "",
          city: "",
          state: "",
          opening_hours: "",
        },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const formattedData: MedicalShopFormData = {
      id: initialData?.id,
      name: values.name,
      location: values.location,
      phone: values.phone,
      email: values.email,
      services: values.services.split(",").map((service) => service.trim()),
      rating: values.rating,
      address: values.address,
      city: values.city,
      state: values.state,
      opening_hours: values.opening_hours,
    };

    try {
      onSubmit(formattedData);
      toast({
        title: `Medical shop ${initialData ? "updated" : "added"} successfully`,
        description: `The medical shop "${values.name}" has been ${
          initialData ? "updated" : "added"
        }.`,
      });
    } catch (error) {
      toast({
        title: `Failed to ${initialData ? "update" : "add"} medical shop`,
        description: (error as Error)?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter medical shop name" {...field} className="bg-background text-foreground" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full address" {...field} className="bg-background text-foreground" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location area" {...field} className="bg-background text-foreground" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} className="bg-background text-foreground" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">State</FormLabel>
                    <FormControl>
                      <Input placeholder="State" {...field} className="bg-background text-foreground" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} className="bg-background text-foreground" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email address" {...field} className="bg-background text-foreground" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="opening_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Opening Hours</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Mon-Fri: 9 AM - 5 PM" 
                      {...field} 
                      className="bg-background text-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="services"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Services</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter services (comma-separated)"
                      {...field}
                      className="bg-background text-foreground min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Rating (0-5)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" min="0" max="5" {...field} className="bg-background text-foreground" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="text-foreground border-border">
            Cancel
          </Button>
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
            {initialData ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MedicalShopForm;
