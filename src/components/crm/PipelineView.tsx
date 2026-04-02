import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, ArrowLeft, Star, Plus, Users, ChevronDown, ChevronUp, X, Zap, Pencil, Check as CheckIcon } from "lucide-react";
import { mockOrganizations, mockContacts, mockOpportunities, salesStageLabels, salesStageColors, teamMembers, type SalesStage, type Organization, type ContactPerson } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const stages: SalesStage[] = ['contact', 'lead', 'opportunity', 'project'];

const StarRating = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) => {
  const sizeClass = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={`${sizeClass} ${star <= rating ? 'text-primary fill-primary' : 'text-muted-foreground/30'}`}
        />
      ))}
    </div>
  );
};

const StarRatingInput = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map(star => (
      <button key={star} type="button" onClick={() => onChange(star)}>
        <Star className={`w-5 h-5 transition-colors ${star <= value ? 'text-primary fill-primary' : 'text-muted-foreground/30 hover:text-primary/50'}`} />
      </button>
    ))}
  </div>
);

const PipelineView = () => {
  const [organizations, setOrganizations] = useState(mockOrganizations);
  const [contacts, setContacts] = useState(mockContacts);
  const [expandedOrg, setExpandedOrg] = useState<string | null>(null);
  const [showAddOrg, setShowAddOrg] = useState(false);
  const [showAddContact, setShowAddContact] = useState<string | null>(null);

  // Form state for new org
  const [newOrg, setNewOrg] = useState({ name: '', sector: '', stage: 'contact' as SalesStage, seriousness: 3, notes: '' });
  const [newContact, setNewContact] = useState({ name: '', role: '', email: '', phone: '', assignedTo: teamMembers[0] });

  const handleAddOrg = () => {
    if (!newOrg.name.trim()) return;
    const org: Organization = {
      id: `org${Date.now()}`,
      name: newOrg.name,
      sector: newOrg.sector,
      stage: newOrg.stage,
      seriousness: newOrg.seriousness,
      notes: newOrg.notes,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setOrganizations(prev => [...prev, org]);
    setNewOrg({ name: '', sector: '', stage: 'contact', seriousness: 3, notes: '' });
    setShowAddOrg(false);
  };

  const handleAddContact = (orgId: string) => {
    if (!newContact.name.trim()) return;
    const contact: ContactPerson = {
      id: `c${Date.now()}`,
      organizationId: orgId,
      name: newContact.name,
      role: newContact.role,
      email: newContact.email,
      phone: newContact.phone,
      assignedTo: newContact.assignedTo,
    };
    setContacts(prev => [...prev, contact]);
    setNewContact({ name: '', role: '', email: '', phone: '', assignedTo: teamMembers[0] });
    setShowAddContact(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">مسار المبيعات</h2>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            {stages.map((stage, i) => (
              <span key={stage} className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${salesStageColors[stage]}`} />
                {salesStageLabels[stage]}
                {i < stages.length - 1 && <ArrowLeft className="w-3 h-3 mx-1" />}
              </span>
            ))}
          </div>
          <Dialog open={showAddOrg} onOpenChange={setShowAddOrg}>
            <DialogTrigger asChild>
              <Button size="sm" className="gradient-gold text-primary-foreground shadow-gold">
                <Plus className="w-4 h-4" />
                إضافة جهة
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">إضافة جهة اتصال جديدة</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">اسم الجهة / المنظمة</label>
                  <Input value={newOrg.name} onChange={e => setNewOrg(p => ({ ...p, name: e.target.value }))} placeholder="مثال: شركة التقنية المتقدمة" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">القطاع</label>
                  <Input value={newOrg.sector} onChange={e => setNewOrg(p => ({ ...p, sector: e.target.value }))} placeholder="مثال: تقنية المعلومات" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">المرحلة</label>
                  <div className="flex gap-2 flex-wrap">
                    {stages.map(stage => (
                      <button
                        key={stage}
                        type="button"
                        onClick={() => setNewOrg(p => ({ ...p, stage }))}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                          newOrg.stage === stage
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border text-muted-foreground hover:border-primary/30'
                        }`}
                      >
                        {salesStageLabels[stage]}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">مدى الجدية</label>
                  <StarRatingInput value={newOrg.seriousness} onChange={v => setNewOrg(p => ({ ...p, seriousness: v }))} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">ملاحظات</label>
                  <Input value={newOrg.notes} onChange={e => setNewOrg(p => ({ ...p, notes: e.target.value }))} placeholder="ملاحظات اختيارية..." />
                </div>
                <Button onClick={handleAddOrg} className="w-full gradient-gold text-primary-foreground shadow-gold">إضافة</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage, stageIndex) => {
          const stageOrgs = organizations.filter(o => o.stage === stage);
          return (
            <motion.div
              key={stage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: stageIndex * 0.1 }}
              className="space-y-3"
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${salesStageColors[stage]}`} />
                  <span className="text-sm font-bold text-foreground">{salesStageLabels[stage]}</span>
                </div>
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                  {stageOrgs.length}
                </span>
              </div>

              {/* Organization Cards */}
              <div className="space-y-2">
                <AnimatePresence>
                  {stageOrgs.map((org) => {
                    const orgContacts = contacts.filter(c => c.organizationId === org.id);
                    const orgOpportunities = mockOpportunities.filter(o => o.organizationId === org.id);
                    const isExpanded = expandedOrg === org.id;
                    const totalValue = orgOpportunities.reduce((sum, o) => sum + (o.value || 0), 0);

                    return (
                      <motion.div
                        key={org.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="gradient-card border border-border rounded-lg shadow-card hover:border-primary/30 transition-colors"
                      >
                        {/* Org Header */}
                        <div
                          className="p-4 cursor-pointer"
                          onClick={() => setExpandedOrg(isExpanded ? null : org.id)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-bold text-foreground">{org.name}</h3>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{org.sector}</p>
                          <div className="flex items-center justify-between">
                            <StarRating rating={org.seriousness} />
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Users className="w-3 h-3" /> {orgContacts.length}
                              </span>
                              {totalValue > 0 && (
                                <span className="text-xs font-bold text-primary">
                                  {totalValue.toLocaleString()} ر.س
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Expanded: Contacts + Opportunities */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                                {/* Contacts */}
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-muted-foreground">الأشخاص</span>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setShowAddContact(org.id); }}
                                      className="text-xs text-primary hover:text-primary/80"
                                    >
                                      + إضافة
                                    </button>
                                  </div>
                                  {orgContacts.map(contact => (
                                    <div key={contact.id} className="flex items-center justify-between py-1.5">
                                      <div>
                                        <p className="text-xs font-medium text-foreground">{contact.name}</p>
                                        <p className="text-[10px] text-muted-foreground">{contact.role} · {contact.assignedTo}</p>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <button className="p-1 rounded bg-secondary hover:bg-secondary/80">
                                          <Phone className="w-3 h-3 text-muted-foreground" />
                                        </button>
                                        <button className="p-1 rounded bg-secondary hover:bg-secondary/80">
                                          <Mail className="w-3 h-3 text-muted-foreground" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Opportunities */}
                                {orgOpportunities.length > 0 && (
                                  <div>
                                    <span className="text-xs font-bold text-muted-foreground block mb-2">الفرص</span>
                                    {orgOpportunities.map(opp => (
                                      <div key={opp.id} className="flex items-center justify-between py-1.5">
                                        <p className="text-xs text-foreground">{opp.title}</p>
                                        <span className="text-xs text-primary font-bold">{opp.value?.toLocaleString()} ر.س</span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Notes */}
                                {org.notes && (
                                  <p className="text-xs text-muted-foreground bg-secondary/50 rounded p-2">{org.notes}</p>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Contact Dialog */}
      <Dialog open={!!showAddContact} onOpenChange={() => setShowAddContact(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">إضافة شخص جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">الاسم</label>
              <Input value={newContact.name} onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))} placeholder="اسم الشخص" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">الدور / المنصب</label>
              <Input value={newContact.role} onChange={e => setNewContact(p => ({ ...p, role: e.target.value }))} placeholder="مثال: مدير تقنية المعلومات" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">البريد الإلكتروني</label>
              <Input value={newContact.email} onChange={e => setNewContact(p => ({ ...p, email: e.target.value }))} placeholder="email@example.com" dir="ltr" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">الهاتف</label>
              <Input value={newContact.phone} onChange={e => setNewContact(p => ({ ...p, phone: e.target.value }))} placeholder="+966 5x xxx xxxx" dir="ltr" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">مسؤول المتابعة</label>
              <div className="flex gap-2 flex-wrap">
                {teamMembers.map(member => (
                  <button
                    key={member}
                    type="button"
                    onClick={() => setNewContact(p => ({ ...p, assignedTo: member }))}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                      newContact.assignedTo === member
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/30'
                    }`}
                  >
                    {member}
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={() => showAddContact && handleAddContact(showAddContact)} className="w-full gradient-gold text-primary-foreground shadow-gold">
              إضافة
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PipelineView;
