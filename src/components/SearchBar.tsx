
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, MapPin, Search, Stethoscope, Microscope, Building, Store } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { value: "all", label: "All Categories", icon: Search },
  { value: "doctors", label: "Doctors", icon: Stethoscope },
  { value: "shops", label: "Medical Shops", icon: Store },
  { value: "labs", label: "Pathology Labs", icon: Microscope },
  { value: "hospitals", label: "Hospitals", icon: Building },
];

const SearchBar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", {
      query,
      category: selectedCategory.value,
      location,
    });
    
    // Here you would typically implement the search logic or redirect to search results
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white/90 backdrop-blur-md shadow-lg rounded-2xl transition-all duration-300 animate-in"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              className="w-full pl-10 h-12 rounded-xl bg-gray-50 border-gray-200 focus:ring-medical-500"
              placeholder="Search by name, specialty, etc."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full md:w-auto">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full md:w-[200px] h-12 justify-between rounded-xl bg-gray-50 border-gray-200 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <selectedCategory.icon className="mr-2 h-4 w-4 text-gray-500" />
                  <span>{selectedCategory.label}</span>
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {categories.map((category) => (
                      <CommandItem
                        key={category.value}
                        value={category.value}
                        onSelect={() => {
                          setSelectedCategory(category);
                          setOpen(false);
                        }}
                      >
                        <category.icon className="mr-2 h-4 w-4 text-gray-500" />
                        <span>{category.label}</span>
                        {selectedCategory.value === category.value && (
                          <Check className="ml-auto h-4 w-4 text-medical-600" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="w-full md:w-auto">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              className="w-full md:w-[180px] pl-10 h-12 rounded-xl bg-gray-50 border-gray-200 focus:ring-medical-500"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="h-12 px-6 rounded-xl bg-medical-600 hover:bg-medical-700 text-white transition-colors"
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
