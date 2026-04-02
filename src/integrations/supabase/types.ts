export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      action_logs: {
        Row: {
          action: string
          action_date: string
          created_at: string
          custom_fields: Json | null
          duration_days: number | null
          from_stage: string
          id: string
          loss_reason: string | null
          organization_id: string | null
          outcome: string
          owner_id: string | null
          to_stage: string | null
        }
        Insert: {
          action: string
          action_date?: string
          created_at?: string
          custom_fields?: Json | null
          duration_days?: number | null
          from_stage: string
          id?: string
          loss_reason?: string | null
          organization_id?: string | null
          outcome?: string
          owner_id?: string | null
          to_stage?: string | null
        }
        Update: {
          action?: string
          action_date?: string
          created_at?: string
          custom_fields?: Json | null
          duration_days?: number | null
          from_stage?: string
          id?: string
          loss_reason?: string | null
          organization_id?: string | null
          outcome?: string
          owner_id?: string | null
          to_stage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "action_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_logs_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      activities: {
        Row: {
          assigned_to_id: string | null
          completed: boolean
          created_at: string
          custom_fields: Json | null
          due_date: string | null
          id: string
          organization_id: string
          priority: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          assigned_to_id?: string | null
          completed?: boolean
          created_at?: string
          custom_fields?: Json | null
          due_date?: string | null
          id?: string
          organization_id: string
          priority?: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          assigned_to_id?: string | null
          completed?: boolean
          created_at?: string
          custom_fields?: Json | null
          due_date?: string | null
          id?: string
          organization_id?: string
          priority?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_assigned_to_id_fkey"
            columns: ["assigned_to_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          assigned_to_id: string | null
          created_at: string
          custom_fields: Json | null
          email: string | null
          id: string
          name: string
          organization_id: string
          phone: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          assigned_to_id?: string | null
          created_at?: string
          custom_fields?: Json | null
          email?: string | null
          id?: string
          name: string
          organization_id: string
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to_id?: string | null
          created_at?: string
          custom_fields?: Json | null
          email?: string | null
          id?: string
          name?: string
          organization_id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_assigned_to_id_fkey"
            columns: ["assigned_to_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_field_definitions: {
        Row: {
          created_at: string
          field_label: string
          field_name: string
          field_type: string
          id: string
          is_required: boolean
          options: Json | null
          sort_order: number
          table_name: string
        }
        Insert: {
          created_at?: string
          field_label: string
          field_name: string
          field_type?: string
          id?: string
          is_required?: boolean
          options?: Json | null
          sort_order?: number
          table_name: string
        }
        Update: {
          created_at?: string
          field_label?: string
          field_name?: string
          field_type?: string
          id?: string
          is_required?: boolean
          options?: Json | null
          sort_order?: number
          table_name?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          created_at: string
          custom_fields: Json | null
          id: string
          notes: string | null
          organization_id: string
          status: string
          title: string
          updated_at: string
          value: number | null
        }
        Insert: {
          created_at?: string
          custom_fields?: Json | null
          id?: string
          notes?: string | null
          organization_id: string
          status?: string
          title: string
          updated_at?: string
          value?: number | null
        }
        Update: {
          created_at?: string
          custom_fields?: Json | null
          id?: string
          notes?: string | null
          organization_id?: string
          status?: string
          title?: string
          updated_at?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          action_owner_id: string | null
          created_at: string
          custom_fields: Json | null
          id: string
          logo_url: string | null
          name: string
          next_action: string | null
          notes: string | null
          sector: string | null
          seriousness: number
          stage: string
          updated_at: string
        }
        Insert: {
          action_owner_id?: string | null
          created_at?: string
          custom_fields?: Json | null
          id?: string
          logo_url?: string | null
          name: string
          next_action?: string | null
          notes?: string | null
          sector?: string | null
          seriousness?: number
          stage?: string
          updated_at?: string
        }
        Update: {
          action_owner_id?: string | null
          created_at?: string
          custom_fields?: Json | null
          id?: string
          logo_url?: string | null
          name?: string
          next_action?: string | null
          notes?: string | null
          sector?: string | null
          seriousness?: number
          stage?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizations_action_owner_id_fkey"
            columns: ["action_owner_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          contact_person: string | null
          created_at: string
          custom_fields: Json | null
          id: string
          last_contact: string | null
          name: string
          revenue: number | null
          services: string[] | null
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          contact_person?: string | null
          created_at?: string
          custom_fields?: Json | null
          id?: string
          last_contact?: string | null
          name: string
          revenue?: number | null
          services?: string[] | null
          status?: string
          type?: string
          updated_at?: string
        }
        Update: {
          contact_person?: string | null
          created_at?: string
          custom_fields?: Json | null
          id?: string
          last_contact?: string | null
          name?: string
          revenue?: number | null
          services?: string[] | null
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          custom_fields: Json | null
          email: string | null
          id: string
          is_active: boolean
          name: string
          phone: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_fields?: Json | null
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_fields?: Json | null
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
