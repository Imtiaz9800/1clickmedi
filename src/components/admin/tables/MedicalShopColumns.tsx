
import React from "react";
import { DataColumn } from "@/components/admin/shared/AdminDataTable";

export const getMedicalShopColumns = (): DataColumn[] => {
  return [
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
      key: "services",
      label: "Services",
      render: (services) => (
        <div className="flex gap-2 flex-wrap">
          {services.map((service: string, index: number) => (
            <span 
              key={index}
              className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full dark:bg-green-800 dark:text-green-100"
            >
              {service}
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
};
