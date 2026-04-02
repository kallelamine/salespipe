import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { mockPartners } from "@/data/mockData";

const typeLabels: Record<string, string> = {
  technology: 'تقني',
  reseller: 'موزع',
  strategic: 'استراتيجي',
};

const statusLabels: Record<string, string> = {
  active: 'نشط',
  prospect: 'محتمل',
  inactive: 'غير نشط',
};

const statusColors: Record<string, string> = {
  active: 'bg-success/20 text-success',
  prospect: 'bg-warning/20 text-warning',
  inactive: 'bg-muted text-muted-foreground',
};

const PartnersView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">إدارة الشركاء</h2>
        <button className="px-4 py-2 text-sm font-medium gradient-gold text-primary-foreground rounded-lg shadow-gold hover:opacity-90 transition-opacity">
          + إضافة شريك
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockPartners.map((partner, i) => (
          <motion.div
            key={partner.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="gradient-card border border-border rounded-xl p-5 shadow-card hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">{partner.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {partner.contactPerson} · {typeLabels[partner.type]}
                </p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[partner.status]}`}>
                {statusLabels[partner.status]}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {partner.services.map(s => (
                <span key={s} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md">
                  {s}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              {partner.revenue ? (
                <span className="text-sm font-bold text-primary">{partner.revenue.toLocaleString()} ر.س</span>
              ) : (
                <span className="text-xs text-muted-foreground">لا توجد إيرادات بعد</span>
              )}
              <button className="p-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors">
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PartnersView;
