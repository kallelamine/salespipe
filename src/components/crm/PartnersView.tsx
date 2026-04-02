import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Plus, Handshake, Building2, Phone, Mail, Star, Filter, X, ChevronDown, ChevronUp, Pencil, Check as CheckIcon, Zap, UserCircle, Upload } from "lucide-react";
import { mockPartners, type Partner } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const typeLabels: Record<string, string> = {
  technology: 'شريك تقني',
  reseller: 'موزع / إعادة بيع',
  strategic: 'شريك استراتيجي',
};

const typeColors: Record<string, string> = {
  technology: 'bg-primary/15 text-primary border-primary/20',
  reseller: 'bg-warning/15 text-warning border-warning/20',
  strategic: 'bg-info/15 text-info border-info/20',
};

const typeIcons: Record<string, string> = {
  technology: '🔧',
  reseller: '🤝',
  strategic: '🎯',
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

const partnerTypes = ['all', 'technology', 'reseller', 'strategic'] as const;
const partnerTypeFilterLabels: Record<string, string> = {
  all: 'الكل',
  technology: 'تقني',
  reseller: 'موزع',
  strategic: 'استراتيجي',
};

const PartnersView = () => {
  const [partners, setPartners] = useState<Partner[]>(mockPartners);
  const [filterType, setFilterType] = useState<string>('all');
  const [expandedPartner, setExpandedPartner] = useState<string | null>(null);
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: '',
    type: 'technology' as Partner['type'],
    status: 'prospect' as Partner['status'],
    services: '',
    contactPerson: '',
    revenue: '',
    notes: '',
  });

  const filteredPartners = filterType === 'all'
    ? partners
    : partners.filter(p => p.type === filterType);

  const groupedByType = {
    technology: filteredPartners.filter(p => p.type === 'technology'),
    reseller: filteredPartners.filter(p => p.type === 'reseller'),
    strategic: filteredPartners.filter(p => p.type === 'strategic'),
  };

  const totalRevenue = partners.reduce((sum, p) => sum + (p.revenue || 0), 0);
  const activeCount = partners.filter(p => p.status === 'active').length;

  const handleAddPartner = () => {
    if (!newPartner.name.trim()) return;
    const partner: Partner = {
      id: `p${Date.now()}`,
      name: newPartner.name,
      type: newPartner.type,
      status: newPartner.status,
      services: newPartner.services.split('،').map(s => s.trim()).filter(Boolean),
      contactPerson: newPartner.contactPerson,
      revenue: newPartner.revenue ? parseInt(newPartner.revenue) : undefined,
      lastContact: new Date().toISOString().split('T')[0],
    };
    setPartners(prev => [...prev, partner]);
    setNewPartner({ name: '', type: 'technology', status: 'prospect', services: '', contactPerson: '', revenue: '', notes: '' });
    setShowAddPartner(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">إدارة الشركاء</h2>
        <Dialog open={showAddPartner} onOpenChange={setShowAddPartner}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-gold text-primary-foreground shadow-gold">
              <Plus className="w-4 h-4" />
              إضافة شريك
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">إضافة شريك جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">اسم الشريك</label>
                <Input value={newPartner.name} onChange={e => setNewPartner(p => ({ ...p, name: e.target.value }))} placeholder="مثال: مايكروسوفت العربية" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">نوع الشراكة</label>
                <div className="flex gap-2 flex-wrap">
                  {(['technology', 'reseller', 'strategic'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewPartner(p => ({ ...p, type }))}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                        newPartner.type === type
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/30'
                      }`}
                    >
                      {typeLabels[type]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">الحالة</label>
                <div className="flex gap-2 flex-wrap">
                  {(['active', 'prospect', 'inactive'] as const).map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setNewPartner(p => ({ ...p, status }))}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                        newPartner.status === status
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/30'
                      }`}
                    >
                      {statusLabels[status]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">الخدمات / المنتجات (مفصولة بفاصلة ،)</label>
                <Input value={newPartner.services} onChange={e => setNewPartner(p => ({ ...p, services: e.target.value }))} placeholder="مثال: حلول سحابية، أمن سيبراني" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">جهة التواصل</label>
                <Input value={newPartner.contactPerson} onChange={e => setNewPartner(p => ({ ...p, contactPerson: e.target.value }))} placeholder="اسم الشخص المسؤول" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">الإيرادات المتوقعة (ر.س)</label>
                <Input value={newPartner.revenue} onChange={e => setNewPartner(p => ({ ...p, revenue: e.target.value }))} placeholder="اختياري" type="number" dir="ltr" />
              </div>
              <Button onClick={handleAddPartner} className="w-full gradient-gold text-primary-foreground shadow-gold">إضافة</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'إجمالي الشركاء', value: partners.length, icon: Handshake },
          { label: 'شركاء نشطون', value: activeCount, icon: Building2 },
          { label: 'إيرادات الشراكات', value: `${totalRevenue.toLocaleString()} ر.س`, icon: Star },
          { label: 'أنواع الشراكات', value: new Set(partners.map(p => p.type)).size, icon: Filter },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="gradient-card border border-border rounded-lg p-4 shadow-card"
          >
            <div className="flex items-center gap-2 mb-1">
              <stat.icon className="w-4 h-4 text-primary" />
              <span className="text-[11px] text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-lg font-bold text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {partnerTypes.map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-1.5 text-xs rounded-lg border transition-colors ${
              filterType === type
                ? 'border-primary bg-primary/10 text-primary font-bold'
                : 'border-border text-muted-foreground hover:border-primary/30'
            }`}
          >
            {partnerTypeFilterLabels[type]}
            <span className="mr-1 text-[10px] opacity-70">
              ({type === 'all' ? partners.length : partners.filter(p => p.type === type).length})
            </span>
          </button>
        ))}
      </div>

      {/* Partners by Type */}
      {filterType === 'all' ? (
        Object.entries(groupedByType).map(([type, typePartners]) => {
          if (typePartners.length === 0) return null;
          return (
            <div key={type} className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <span className="text-base">{typeIcons[type]}</span>
                <h3 className="text-sm font-bold text-foreground">{typeLabels[type]}</h3>
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">{typePartners.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {typePartners.map((partner, i) => (
                  <PartnerCard
                    key={partner.id}
                    partner={partner}
                    index={i}
                    isExpanded={expandedPartner === partner.id}
                    onToggle={() => setExpandedPartner(expandedPartner === partner.id ? null : partner.id)}
                  />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredPartners.map((partner, i) => (
            <PartnerCard
              key={partner.id}
              partner={partner}
              index={i}
              isExpanded={expandedPartner === partner.id}
              onToggle={() => setExpandedPartner(expandedPartner === partner.id ? null : partner.id)}
            />
          ))}
        </div>
      )}

      {filteredPartners.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Handshake className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">لا يوجد شركاء في هذا التصنيف</p>
        </div>
      )}
    </div>
  );
};

const PartnerCard = ({ partner, index, isExpanded, onToggle }: { partner: Partner; index: number; isExpanded: boolean; onToggle: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="gradient-card border border-border rounded-xl shadow-card hover:border-primary/30 transition-colors"
  >
    <div className="p-5 cursor-pointer" onClick={onToggle}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 shrink-0 rounded-lg bg-secondary flex items-center justify-center border border-border text-lg">
            {typeIcons[partner.type]}
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">{partner.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <UserCircle className="w-3 h-3" /> {partner.contactPerson}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${typeColors[partner.type]}`}>
            {typeLabels[partner.type]}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </div>

      {/* Status + Revenue */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[partner.status]}`}>
          {statusLabels[partner.status]}
        </span>
        {partner.revenue ? (
          <span className="text-sm font-bold text-primary">{partner.revenue.toLocaleString()} ر.س</span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </div>

      {/* Services */}
      <div className="flex flex-wrap gap-1.5">
        {partner.services.map(s => (
          <span key={s} className="text-[11px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md">
            {s}
          </span>
        ))}
      </div>
    </div>

    {/* Expanded Details */}
    {isExpanded && (
      <div className="px-5 pb-5 border-t border-border pt-3 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">آخر تواصل</span>
          <span className="text-foreground font-medium">{partner.lastContact}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">عدد الخدمات</span>
          <span className="text-foreground font-medium">{partner.services.length}</span>
        </div>
        <div className="flex gap-2 mt-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground transition-colors">
            <Phone className="w-3.5 h-3.5" /> اتصال
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground transition-colors">
            <Mail className="w-3.5 h-3.5" /> بريد
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> تفاصيل
          </button>
        </div>
      </div>
    )}
  </motion.div>
);

export default PartnersView;
