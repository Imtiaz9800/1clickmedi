
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

export interface LabFormData {
  id?: string;
  name: string;
  location: string;
  phone: string;
  email: string;
  tests: string[];
  rating: number;
}

interface LabFormProps {
  initialData?: LabFormData;
  onSubmit: (data: LabFormData) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  tests: z.string().min(1, "Tests are required"),
  rating: z.coerce.number().min(0).max(5),
});

export const LabForm: React.FC<LabFormProps> = ({
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
          phone: initialData.contact?.phone || "",
          email: initialData.contact?.email || "",
          tests: initialData.tests?.join(", ") || "",
          rating: initialData.rating || 4,
        }
      : {
          name: "",
          location: "",
          phone: "",
          email: "",
          tests: "",
          rating: 4,
        },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const formattedData: LabFormData = {
      id: initialData?.id,
      name: values.name,
      location: values.location,
      phone: values.phone,
      email: values.email,
      tests: values.tests.split(",").map((test) => test.trim()),
      rating: values.rating,
    };

    try {
      onSubmit(formattedData);
      toast({
        title: `Lab ${initialData ? "updated" : "added"} successfully`,
        description: `The lab "${values.name}" has been ${
          initialData ? "updated" : "added"
        }.`,
      });
    } catch (error) {
      toast({
        title: `Failed to ${initialData ? "update" : "add"} lab`,
        description: (error as Error)?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter lab name" {...field} />
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
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tests</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter tests offered (comma-separated)"
                  {...field}
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
              <FormLabel>Rating (0-5)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" min="0" max="5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{initialData ? "Update" : "Add"}</Button>
        </div>
      </form>
    </Form>
  );
};

export default LabForm;
