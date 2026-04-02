export type ContactStage = 'contact' | 'lead' | 'opportunity' | 'project';

export interface Contact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  stage: ContactStage;
  value?: number;
  notes?: string;
  lastActivity: string;
  createdAt: string;
}

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

export interface Activity {
  id: string;
  title: string;
  type: 'call' | 'meeting' | 'email' | 'task' | 'followup';
  relatedTo: string;
  dueDate: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export const stageLabels: Record<ContactStage, string> = {
  contact: 'جهة اتصال',
  lead: 'عميل محتمل',
  opportunity: 'فرصة',
  project: 'مشروع',
};

export const stageColors: Record<ContactStage, string> = {
  contact: 'bg-info',
  lead: 'bg-warning',
  opportunity: 'bg-primary',
  project: 'bg-success',
};

export const mockContacts: Contact[] = [
  { id: '1', name: 'أحمد الغامدي', company: 'شركة التقنية المتقدمة', email: 'ahmed@tech.sa', phone: '+966 55 123 4567', stage: 'contact', lastActivity: '2026-04-01', createdAt: '2026-03-15' },
  { id: '2', name: 'سارة القحطاني', company: 'مجموعة الابتكار', email: 'sara@innov.sa', phone: '+966 50 234 5678', stage: 'lead', value: 150000, lastActivity: '2026-03-30', createdAt: '2026-02-20' },
  { id: '3', name: 'محمد العتيبي', company: 'حلول رقمية', email: 'mohammed@digital.sa', phone: '+966 54 345 6789', stage: 'opportunity', value: 450000, lastActivity: '2026-03-28', createdAt: '2026-01-10' },
  { id: '4', name: 'نورة الشمري', company: 'مؤسسة النمو', email: 'noura@growth.sa', phone: '+966 56 456 7890', stage: 'project', value: 800000, lastActivity: '2026-04-02', createdAt: '2025-12-05' },
  { id: '5', name: 'خالد المطيري', company: 'شركة البيانات الذكية', email: 'khaled@smartdata.sa', phone: '+966 55 567 8901', stage: 'lead', value: 200000, lastActivity: '2026-03-25', createdAt: '2026-03-01' },
  { id: '6', name: 'فاطمة الحربي', company: 'تقنيات السحاب', email: 'fatima@cloud.sa', phone: '+966 50 678 9012', stage: 'opportunity', value: 350000, lastActivity: '2026-03-29', createdAt: '2026-02-15' },
  { id: '7', name: 'عبدالله الدوسري', company: 'شركة الأمان الرقمي', email: 'abdullah@security.sa', phone: '+966 54 789 0123', stage: 'contact', lastActivity: '2026-04-01', createdAt: '2026-03-28' },
  { id: '8', name: 'ريم السبيعي', company: 'منصة الحلول', email: 'reem@solutions.sa', phone: '+966 56 890 1234', stage: 'project', value: 1200000, lastActivity: '2026-04-02', createdAt: '2025-11-10' },
];

export const mockPartners: Partner[] = [
  { id: '1', name: 'مايكروسوفت العربية', type: 'technology', status: 'active', services: ['Azure', 'M365', 'Dynamics'], contactPerson: 'طارق الأحمد', revenue: 500000, lastContact: '2026-03-30' },
  { id: '2', name: 'أوراكل الشرق الأوسط', type: 'technology', status: 'active', services: ['قواعد بيانات', 'ERP', 'سحابة'], contactPerson: 'لينا المنصور', revenue: 300000, lastContact: '2026-03-28' },
  { id: '3', name: 'شركة النظم المتكاملة', type: 'reseller', status: 'prospect', services: ['حلول أمنية', 'شبكات'], contactPerson: 'سعد الرشيدي', lastContact: '2026-03-20' },
  { id: '4', name: 'مجموعة الاستشارات الرقمية', type: 'strategic', status: 'active', services: ['استشارات', 'تحول رقمي'], contactPerson: 'هند العمري', revenue: 200000, lastContact: '2026-04-01' },
];

export const mockActivities: Activity[] = [
  { id: '1', title: 'اتصال متابعة مع أحمد الغامدي', type: 'call', relatedTo: 'أحمد الغامدي', dueDate: '2026-04-03', completed: false, priority: 'high' },
  { id: '2', title: 'اجتماع عرض تقني مع حلول رقمية', type: 'meeting', relatedTo: 'محمد العتيبي', dueDate: '2026-04-04', completed: false, priority: 'high' },
  { id: '3', title: 'إرسال عرض سعر لمجموعة الابتكار', type: 'email', relatedTo: 'سارة القحطاني', dueDate: '2026-04-03', completed: false, priority: 'medium' },
  { id: '4', title: 'مراجعة عقد مؤسسة النمو', type: 'task', relatedTo: 'نورة الشمري', dueDate: '2026-04-05', completed: false, priority: 'medium' },
  { id: '5', title: 'متابعة شراكة مع النظم المتكاملة', type: 'followup', relatedTo: 'شركة النظم المتكاملة', dueDate: '2026-04-02', completed: true, priority: 'low' },
  { id: '6', title: 'تحديث بيانات البيانات الذكية', type: 'task', relatedTo: 'خالد المطيري', dueDate: '2026-04-06', completed: false, priority: 'low' },
];
