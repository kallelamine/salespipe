
-- Function for auto-updating updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ===== Team Members =====
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to team_members" ON public.team_members FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== Organizations =====
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sector TEXT DEFAULT '',
  stage TEXT NOT NULL DEFAULT 'contact' CHECK (stage IN ('contact', 'lead', 'opportunity', 'project')),
  seriousness INTEGER NOT NULL DEFAULT 3 CHECK (seriousness BETWEEN 1 AND 5),
  notes TEXT DEFAULT '',
  next_action TEXT DEFAULT '',
  action_owner_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  logo_url TEXT DEFAULT '',
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to organizations" ON public.organizations FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_organizations_stage ON public.organizations(stage);
CREATE INDEX idx_organizations_action_owner ON public.organizations(action_owner_id);

-- ===== Contacts =====
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  assigned_to_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to contacts" ON public.contacts FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_contacts_org ON public.contacts(organization_id);

-- ===== Opportunities =====
CREATE TABLE public.opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  value NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'won', 'lost')),
  notes TEXT DEFAULT '',
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to opportunities" ON public.opportunities FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON public.opportunities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_opportunities_org ON public.opportunities(organization_id);

-- ===== Activities =====
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'task' CHECK (type IN ('call', 'meeting', 'email', 'task', 'presentation', 'followup')),
  due_date DATE,
  completed BOOLEAN NOT NULL DEFAULT false,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  assigned_to_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to activities" ON public.activities FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_activities_org ON public.activities(organization_id);

-- ===== Action Logs =====
CREATE TABLE public.action_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  owner_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  outcome TEXT NOT NULL DEFAULT 'pending' CHECK (outcome IN ('success', 'lost', 'pending')),
  from_stage TEXT NOT NULL,
  to_stage TEXT,
  duration_days INTEGER DEFAULT 0,
  loss_reason TEXT DEFAULT '',
  custom_fields JSONB DEFAULT '{}',
  action_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.action_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to action_logs" ON public.action_logs FOR ALL USING (true) WITH CHECK (true);
CREATE INDEX idx_action_logs_org ON public.action_logs(organization_id);
CREATE INDEX idx_action_logs_owner ON public.action_logs(owner_id);
CREATE INDEX idx_action_logs_outcome ON public.action_logs(outcome);

-- ===== Partners =====
CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'technology' CHECK (type IN ('reseller', 'technology', 'strategic')),
  status TEXT NOT NULL DEFAULT 'prospect' CHECK (status IN ('active', 'prospect', 'inactive')),
  services TEXT[] DEFAULT '{}',
  contact_person TEXT DEFAULT '',
  revenue NUMERIC DEFAULT 0,
  last_contact DATE,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to partners" ON public.partners FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON public.partners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== Custom Field Definitions =====
CREATE TABLE public.custom_field_definitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  field_name TEXT NOT NULL,
  field_label TEXT NOT NULL,
  field_type TEXT NOT NULL DEFAULT 'text' CHECK (field_type IN ('text', 'number', 'date', 'boolean', 'select', 'multiselect', 'url', 'email', 'phone')),
  options JSONB DEFAULT '[]',
  is_required BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(table_name, field_name)
);
ALTER TABLE public.custom_field_definitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to custom_field_definitions" ON public.custom_field_definitions FOR ALL USING (true) WITH CHECK (true);
