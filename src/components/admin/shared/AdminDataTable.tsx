
import React from "react";
import { Plus, Pen, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export type DataColumn = {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
  className?: string;
};

export type TagData = {
  text: string;
  color: string;
};

type AdminDataTableProps = {
  title: string;
  description: string;
  addButtonText: string;
  addButtonColor: string;
  data: any[];
  columns: DataColumn[];
  onAdd?: () => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  isLoading?: boolean; // Added isLoading prop
};

const AdminDataTable: React.FC<AdminDataTableProps> = ({
  title,
  description,
  addButtonText,
  addButtonColor,
  data,
  columns,
  onAdd,
  onEdit,
  onDelete,
  isLoading = false, // Added with a default value of false
}) => {
  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
        <Button className={`${addButtonColor}`} onClick={onAdd}>
          <Plus className="w-4 h-4 mr-2" />
          {addButtonText}
        </Button>
      </div>

      <div className="rounded-lg border dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead 
                    key={column.key} 
                    className={column.className || ""}
                  >
                    {column.label}
                  </TableHead>
                ))}
                {(onEdit || onDelete) && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="text-center py-10">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">Loading data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="text-center py-10 text-gray-500 dark:text-gray-400">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow 
                    key={item.id || index} 
                    className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {columns.map((column) => (
                      <TableCell key={`${index}-${column.key}`} className={column.className || ""}>
                        {column.render 
                          ? column.render(item[column.key], item) 
                          : item[column.key]}
                      </TableCell>
                    ))}
                    {(onEdit || onDelete) && (
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          {onEdit && (
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onEdit(item)}>
                              <Pen className="h-4 w-4" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8 text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
                              onClick={() => onDelete(item)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default AdminDataTable;
