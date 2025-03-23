
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus, Pen, Trash } from "lucide-react";

const HospitalManagement = () => {
  return (
    <AdminLayout title="Hospital Management">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-300">
          Add, edit, or remove hospitals from the database.
        </p>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Hospital
        </Button>
      </div>

      <div className="rounded-lg border dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-gray-500 dark:text-gray-400">Name</th>
                <th className="px-4 py-3 text-left text-gray-500 dark:text-gray-400">Location</th>
                <th className="px-4 py-3 text-left text-gray-500 dark:text-gray-400">Contact</th>
                <th className="px-4 py-3 text-left text-gray-500 dark:text-gray-400">Specialties</th>
                <th className="px-4 py-3 text-left text-gray-500 dark:text-gray-400">Rating</th>
                <th className="px-4 py-3 text-left text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* Example row */}
              <tr className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-3 text-gray-900 dark:text-white">Apollo Hospitals</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">Chennai, Tamil Nadu</td>
                <td className="px-4 py-3">
                  <div className="text-gray-900 dark:text-white">+91-9876543226</div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">apollo@example.com</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 flex-wrap">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
                      Cardiology
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
                      Neurology
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-gray-900 dark:text-white">4.8</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Pen className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default HospitalManagement;
