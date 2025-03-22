
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";

interface PreferencesSettingsProps {
  darkModeEnabled: boolean;
  onDarkModeChange: (enabled: boolean) => void;
}

const PreferencesSettings = ({ darkModeEnabled, onDarkModeChange }: PreferencesSettingsProps) => {
  const toggleDarkMode = (enabled: boolean) => {
    onDarkModeChange(enabled);
    
    if (enabled) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
    
    toast({
      title: enabled ? "Dark mode enabled" : "Light mode enabled",
      duration: 1500,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize the appearance of the application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <p className="text-sm text-gray-500">
              Enable dark mode for a better viewing experience at night
            </p>
          </div>
          <Switch
            id="dark-mode"
            checked={darkModeEnabled}
            onCheckedChange={toggleDarkMode}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PreferencesSettings;
