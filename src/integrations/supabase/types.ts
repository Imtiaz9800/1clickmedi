export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      doctors: {
        Row: {
          address: string
          bio: string
          category_id: string | null
          city: string
          created_at: string
          email: string
          experience: number
          id: string
          image_url: string | null
          latitude: number | null
          longitude: number | null
          name: string
          phone: string
          qualifications: string
          rating: number | null
          specialty: string
          state: string
          working_hours: string
        }
        Insert: {
          address: string
          bio: string
          category_id?: string | null
          city: string
          created_at?: string
          email: string
          experience: number
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          phone: string
          qualifications: string
          rating?: number | null
          specialty: string
          state: string
          working_hours: string
        }
        Update: {
          address?: string
          bio?: string
          category_id?: string | null
          city?: string
          created_at?: string
          email?: string
          experience?: number
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string
          qualifications?: string
          rating?: number | null
          specialty?: string
          state?: string
          working_hours?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctors_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          address: string
          beds: number | null
          city: string
          created_at: string
          email: string
          emergency_services: boolean
          facilities: string[]
          id: string
          image_url: string | null
          latitude: number | null
          longitude: number | null
          name: string
          phone: string
          rating: number | null
          specialties: string[]
          state: string
        }
        Insert: {
          address: string
          beds?: number | null
          city: string
          created_at?: string
          email: string
          emergency_services: boolean
          facilities: string[]
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          phone: string
          rating?: number | null
          specialties: string[]
          state: string
        }
        Update: {
          address?: string
          beds?: number | null
          city?: string
          created_at?: string
          email?: string
          emergency_services?: boolean
          facilities?: string[]
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string
          rating?: number | null
          specialties?: string[]
          state?: string
        }
        Relationships: []
      }
      medical_shops: {
        Row: {
          address: string
          city: string
          created_at: string
          email: string
          id: string
          image_url: string | null
          latitude: number | null
          longitude: number | null
          name: string
          opening_hours: string
          phone: string
          rating: number | null
          services: string[]
          state: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          email: string
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          opening_hours: string
          phone: string
          rating?: number | null
          services: string[]
          state: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          email?: string
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          opening_hours?: string
          phone?: string
          rating?: number | null
          services?: string[]
          state?: string
        }
        Relationships: []
      }
      pathology_labs: {
        Row: {
          address: string
          city: string
          created_at: string
          email: string
          id: string
          image_url: string | null
          latitude: number | null
          longitude: number | null
          name: string
          opening_hours: string
          phone: string
          rating: number | null
          state: string
          tests_offered: string[]
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          email: string
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          opening_hours: string
          phone: string
          rating?: number | null
          state: string
          tests_offered: string[]
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          email?: string
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          opening_hours?: string
          phone?: string
          rating?: number | null
          state?: string
          tests_offered?: string[]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
