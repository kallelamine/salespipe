// ===== أنواع المراحل =====
export type SalesStage = 'contact' | 'lead' | 'opportunity' | 'project';

export const salesStageLabels: Record<SalesStage, string> = {
  contact: 'تواصل',
  lead: 'عميل محتمل',
  opportunity: 'فرصة',
  project: 'مشروع',
};

export const salesStageColors: Record<SalesStage, string> = {
  contact: 'bg-info',
  lead: 'bg-warning',
  opportunity: 'bg-primary',
  project: 'bg-success',
};

// ===== المنظمة (الجهة) =====
export interface Organization {
  id: string;
  name: string;
  sector: string;
  stage: SalesStage;
  seriousness: number; // 1-5 نجوم
  notes?: string;
  createdAt: string;
}

// ===== جهة الاتصال (شخص داخل المنظمة) =====
export interface ContactPerson {
  id: string;
  organizationId: string;
  name: string;
  role: string; // مثل: مدير تقنية المعلومات، مدير الابتكار
  email: string;
  phone: string;
  assignedTo: string; // اسم عضو الفريق المسؤول
}

// ===== الفرصة =====
export interface Opportunity {
  id: string;
  organizationId: string;
  title: string; // اسم الخدمة أو المنتج
  value?: number;
  status: 'active' | 'won' | 'lost';
  notes?: string;
  createdAt: string;
}

// ===== النشاط =====
export interface Activity {
  id: string;
  organizationId: string;
  title: string;
  type: 'call' | 'meeting' | 'email' | 'task' | 'presentation' | 'followup';
  dueDate: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

// ===== الشريك =====
export interface Partner {
  id: string;
  name: string;
  type: 'reseller' | 'technology' | 'strategic';
  status: 'active' | 'prospect' | 'inactive';
  services: string[];
  contactPerson: string;
  revenue?: number;
  lastContact: string;
}

// ===== أعضاء الفريق =====
export const teamMembers = [
  'أنا',
  'سارة',
  'محمد',
  'نورة',
];

// ===== بيانات تجريبية =====
export const mockOrganizations: Organization[] = [
  { id: 'org1', name: 'شركة التقنية المتقدمة', sector: 'تقنية المعلومات', stage: 'contact', seriousness: 2, createdAt: '2026-03-15', notes: 'تم التواصل المبدئي عبر معرض جيتكس' },
  { id: 'org2', name: 'مجموعة الابتكار', sector: 'الابتكار والتحول الرقمي', stage: 'lead', seriousness: 4, createdAt: '2026-02-20', notes: 'مهتمون بعرض تقديمي عن خدمات السحابة' },
  { id: 'org3', name: 'حلول رقمية', sector: 'البرمجيات', stage: 'opportunity', seriousness: 5, createdAt: '2026-01-10', notes: 'فرصة قوية - طلبوا عرض سعر' },
  { id: 'org4', name: 'مؤسسة النمو', sector: 'الاستشارات', stage: 'project', seriousness: 5, createdAt: '2025-12-05', notes: 'تم توقيع العقد' },
  { id: 'org5', name: 'شركة البيانات الذكية', sector: 'تحليل البيانات', stage: 'lead', seriousness: 3, createdAt: '2026-03-01' },
  { id: 'org6', name: 'تقنيات السحاب', sector: 'الحوسبة السحابية', stage: 'opportunity', seriousness: 4, createdAt: '2026-02-15' },
  { id: 'org7', name: 'شركة الأمان الرقمي', sector: 'الأمن السيبراني', stage: 'contact', seriousness: 1, createdAt: '2026-03-28' },
];

export const mockContacts: ContactPerson[] = [
  { id: 'c1', organizationId: 'org1', name: 'أحمد الغامدي', role: 'مدير تقنية المعلومات', email: 'ahmed@tech.sa', phone: '+966 55 123 4567', assignedTo: 'أنا' },
  { id: 'c2', organizationId: 'org1', name: 'فهد السعيد', role: 'مدير الابتكار', email: 'fahad@tech.sa', phone: '+966 55 987 6543', assignedTo: 'سارة' },
  { id: 'c3', organizationId: 'org2', name: 'سارة القحطاني', role: 'الرئيس التنفيذي', email: 'sara@innov.sa', phone: '+966 50 234 5678', assignedTo: 'أنا' },
  { id: 'c4', organizationId: 'org3', name: 'محمد العتيبي', role: 'مدير المشتريات', email: 'mohammed@digital.sa', phone: '+966 54 345 6789', assignedTo: 'محمد' },
  { id: 'c5', organizationId: 'org4', name: 'نورة الشمري', role: 'مدير المشاريع', email: 'noura@growth.sa', phone: '+966 56 456 7890', assignedTo: 'نورة' },
  { id: 'c6', organizationId: 'org5', name: 'خالد المطيري', role: 'المدير العام', email: 'khaled@smartdata.sa', phone: '+966 55 567 8901', assignedTo: 'أنا' },
  { id: 'c7', organizationId: 'org6', name: 'فاطمة الحربي', role: 'مدير التطوير', email: 'fatima@cloud.sa', phone: '+966 50 678 9012', assignedTo: 'سارة' },
  { id: 'c8', organizationId: 'org7', name: 'عبدالله الدوسري', role: 'مسؤول الأمن', email: 'abdullah@security.sa', phone: '+966 54 789 0123', assignedTo: 'محمد' },
];

export const mockOpportunities: Opportunity[] = [
  { id: 'opp1', organizationId: 'org3', title: 'نظام إدارة المحتوى', value: 250000, status: 'active', createdAt: '2026-02-01' },
  { id: 'opp2', organizationId: 'org3', title: 'تطبيق جوال', value: 180000, status: 'active', createdAt: '2026-02-15' },
  { id: 'opp3', organizationId: 'org6', title: 'هجرة سحابية', value: 350000, status: 'active', createdAt: '2026-03-01' },
  { id: 'opp4', organizationId: 'org4', title: 'منصة تحول رقمي', value: 800000, status: 'won', createdAt: '2025-12-20' },
];

export const mockActivities: Activity[] = [
  { id: 'a1', organizationId: 'org1', title: 'اتصال متابعة مع أحمد الغامدي', type: 'call', dueDate: '2026-04-03', completed: false, priority: 'high' },
  { id: 'a2', organizationId: 'org3', title: 'عرض تقديمي لحلول رقمية', type: 'presentation', dueDate: '2026-04-04', completed: false, priority: 'high' },
  { id: 'a3', organizationId: 'org2', title: 'إرسال عرض سعر لمجموعة الابتكار', type: 'email', dueDate: '2026-04-03', completed: false, priority: 'medium' },
  { id: 'a4', organizationId: 'org4', title: 'مراجعة عقد مؤسسة النمو', type: 'task', dueDate: '2026-04-05', completed: false, priority: 'medium' },
  { id: 'a5', organizationId: 'org5', title: 'متابعة مع البيانات الذكية', type: 'followup', dueDate: '2026-04-02', completed: true, priority: 'low' },
];

export const mockPartners: Partner[] = [
  { id: '1', name: 'مايكروسوفت العربية', type: 'technology', status: 'active', services: ['Azure', 'M365', 'Dynamics'], contactPerson: 'طارق الأحمد', revenue: 500000, lastContact: '2026-03-30' },
  { id: '2', name: 'أوراكل الشرق الأوسط', type: 'technology', status: 'active', services: ['قواعد بيانات', 'ERP', 'سحابة'], contactPerson: 'لينا المنصور', revenue: 300000, lastContact: '2026-03-28' },
  { id: '3', name: 'شركة النظم المتكاملة', type: 'reseller', status: 'prospect', services: ['حلول أمنية', 'شبكات'], contactPerson: 'سعد الرشيدي', lastContact: '2026-03-20' },
  { id: '4', name: 'مجموعة الاستشارات الرقمية', type: 'strategic', status: 'active', services: ['استشارات', 'تحول رقمي'], contactPerson: 'هند العمري', revenue: 200000, lastContact: '2026-04-01' },
];
