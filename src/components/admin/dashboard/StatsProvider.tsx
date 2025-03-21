
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Stats {
  doctors: number;
  medicalShops: number;
  labs: number;
  hospitals: number;
  contactMessages: number;
}

interface StatsProviderProps {
  children: (stats: Stats, isLoading: boolean) => React.ReactNode;
}

const StatsProvider: React.FC<StatsProviderProps> = ({ children }) => {
  const [stats, setStats] = useState<Stats>({
    doctors: 0,
    medicalShops: 0,
    labs: 0,
    hospitals: 0,
    contactMessages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          doctorsData,
          shopsData,
          labsData,
          hospitalsData,
        ] = await Promise.all([
          supabase.from('doctors').select('count'),
          supabase.from('medical_shops').select('count'),
          supabase.from('pathology_labs').select('count'),
          supabase.from('hospitals').select('count')
        ]);

        // Set a default value for contact messages since the table might not exist yet
        const contactMessages = 0;

        setStats({
          doctors: doctorsData.count || 0,
          medicalShops: shopsData.count || 0,
          labs: labsData.count || 0,
          hospitals: hospitalsData.count || 0,
          contactMessages: contactMessages,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return <>{children(stats, isLoading)}</>;
};

export default StatsProvider;
