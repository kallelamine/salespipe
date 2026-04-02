import { motion } from "framer-motion";
import { Users, Target, Briefcase, DollarSign } from "lucide-react";
import { mockContacts } from "@/data/mockData";

const StatsCards = () => {
  const contacts = mockContacts.filter(c => c.stage === 'contact').length;
  const leads = mockContacts.filter(c => c.stage === 'lead').length;
  const opportunities = mockContacts.filter(c => c.stage === 'opportunity').length;
  const projects = mockContacts.filter(c => c.stage === 'project').length;
  const totalRevenue = mockContacts.filter(c => c.value).reduce((sum, c) => sum + (c.value || 0), 0);

  const stats = [
    { label: 'جهات الاتصال', value: contacts, icon: Users, color: 'text-info' },
    { label: 'عملاء محتملون', value: leads, icon: Target, color: 'text-warning' },
    { label: 'فرص مفتوحة', value: opportunities, icon: Briefcase, color: 'text-primary' },
    { label: 'إجمالي الإيرادات', value: `${(totalRevenue / 1000).toFixed(0)}K ر.س`, icon: DollarSign, color: 'text-success' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="gradient-card rounded-xl border border-border p-5 shadow-card"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <Icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsCards;
