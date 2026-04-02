import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

// ===== Organizations =====
export const useOrganizations = () =>
  useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useCreateOrganization = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (org: TablesInsert<"organizations">) => {
      const { data, error } = await supabase.from("organizations").insert(org).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["organizations"] }),
  });
};

export const useUpdateOrganization = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"organizations"> & { id: string }) => {
      const { data, error } = await supabase.from("organizations").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["organizations"] }),
  });
};

export const useDeleteOrganization = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("organizations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["organizations"] }),
  });
};

// ===== Contacts =====
export const useContacts = () =>
  useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useCreateContact = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (contact: TablesInsert<"contacts">) => {
      const { data, error } = await supabase.from("contacts").insert(contact).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contacts"] }),
  });
};

// ===== Opportunities =====
export const useOpportunities = () =>
  useQuery({
    queryKey: ["opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase.from("opportunities").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

// ===== Activities =====
export const useActivities = () =>
  useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const { data, error } = await supabase.from("activities").select("*").order("due_date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

export const useUpdateActivity = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"activities"> & { id: string }) => {
      const { data, error } = await supabase.from("activities").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["activities"] }),
  });
};

// ===== Action Logs =====
export const useActionLogs = () =>
  useQuery({
    queryKey: ["action_logs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("action_logs").select("*").order("action_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useCreateActionLog = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (log: TablesInsert<"action_logs">) => {
      const { data, error } = await supabase.from("action_logs").insert(log).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["action_logs"] }),
  });
};

// ===== Partners =====
export const usePartners = () =>
  useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const { data, error } = await supabase.from("partners").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useCreatePartner = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (partner: TablesInsert<"partners">) => {
      const { data, error } = await supabase.from("partners").insert(partner).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["partners"] }),
  });
};

// ===== Team Members =====
export const useTeamMembers = () =>
  useQuery({
    queryKey: ["team_members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("team_members").select("*").eq("is_active", true).order("name");
      if (error) throw error;
      return data;
    },
  });

export const useCreateTeamMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (member: TablesInsert<"team_members">) => {
      const { data, error } = await supabase.from("team_members").insert(member).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["team_members"] }),
  });
};

export const useDeleteTeamMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("team_members").update({ is_active: false }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["team_members"] }),
  });
};
