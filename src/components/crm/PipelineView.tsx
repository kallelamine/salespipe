import { useState } from "react";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { Phone, Mail, ArrowLeft, Star, Plus, Users, ChevronDown, ChevronUp, X, Zap, Pencil, Check as CheckIcon, Building2, UserCircle, GripVertical } from "lucide-react";

import { mockOrganizations, mockContacts, mockOpportunities, salesStageLabels, salesStageColors, type SalesStage, type Organization, type ContactPerson } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CsvImportDialog from "./CsvImportDialog";

interface PipelineViewProps {
  teamMembers: string[];
}

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
  const [editingAction, setEditingAction] = useState<string | null>(null);
  const [editActionValue, setEditActionValue] = useState('');
  const [editActionOwner, setEditActionOwner] = useState('');

  // Form state for new org
  const [newOrg, setNewOrg] = useState({ name: '', sector: '', stage: 'contact' as SalesStage, seriousness: 3, notes: '', nextAction: '', actionOwner: teamMembers[0] });
  const [newContact, setNewContact] = useState({ name: '', role: '', email: '', phone: '', assignedTo: teamMembers[0] });

  const handleSaveNextAction = (orgId: string) => {
    setOrganizations(prev => prev.map(o => o.id === orgId ? { ...o, nextAction: editActionValue, actionOwner: editActionOwner } : o));
    setEditingAction(null);
  };

  const handleDragEnd = (result: DropResult) => {
    const { draggableId, destination } = result;
    if (!destination) return;
    const newStage = destination.droppableId as SalesStage;
    setOrganizations(prev => prev.map(o => o.id === draggableId ? { ...o, stage: newStage } : o));
  };

  const handleAddOrg = () => {
    if (!newOrg.name.trim()) return;
    const org: Organization = {
      id: `org${Date.now()}`,
      name: newOrg.name,
      sector: newOrg.sector,
      stage: newOrg.stage,
      seriousness: newOrg.seriousness,
      notes: newOrg.notes,
      nextAction: newOrg.nextAction,
      actionOwner: newOrg.actionOwner,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setOrganizations(prev => [...prev, org]);
    setNewOrg({ name: '', sector: '', stage: 'contact', seriousness: 3, notes: '', nextAction: '', actionOwner: teamMembers[0] });
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
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">الخطوة القادمة (Next Best Action)</label>
                  <Input value={newOrg.nextAction} onChange={e => setNewOrg(p => ({ ...p, nextAction: e.target.value }))} placeholder="مثال: جدولة اجتماع تعريفي" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">المسؤول عن الخطوة القادمة</label>
                  <div className="flex gap-2 flex-wrap">
                    {teamMembers.map(member => (
                      <button
                        key={member}
                        type="button"
                        onClick={() => setNewOrg(p => ({ ...p, actionOwner: member }))}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                          newOrg.actionOwner === member
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border text-muted-foreground hover:border-primary/30'
                        }`}
                      >
                        {member}
                      </button>
                    ))}
                  </div>
                </div>
                <Button onClick={handleAddOrg} className="w-full gradient-gold text-primary-foreground shadow-gold">إضافة</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
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

                {/* Droppable Column */}
                <Droppable droppableId={stage}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-2 min-h-[80px] rounded-lg p-1 transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5 border border-dashed border-primary/30' : ''}`}
                    >
                      {stageOrgs.map((org, index) => {
                        const orgContacts = contacts.filter(c => c.organizationId === org.id);
                        const orgOpportunities = mockOpportunities.filter(o => o.organizationId === org.id);
                        const isExpanded = expandedOrg === org.id;
                        const totalValue = orgOpportunities.reduce((sum, o) => sum + (o.value || 0), 0);

                        return (
                          <Draggable key={org.id} draggableId={org.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`gradient-card border border-border rounded-lg shadow-card hover:border-primary/30 transition-colors ${snapshot.isDragging ? 'shadow-lg ring-2 ring-primary/20' : ''}`}
                              >
                                {/* Org Header */}
                                <div
                                  className="p-4 cursor-pointer"
                                  onClick={() => setExpandedOrg(isExpanded ? null : org.id)}
                                >
                                  {/* Icon + Name row */}
                                  <div className="flex items-start gap-3 mb-3">
                                    <div {...provided.dragHandleProps} className="h-9 w-9 shrink-0 rounded-lg bg-secondary flex items-center justify-center border border-border cursor-grab active:cursor-grabbing hover:bg-secondary/80 transition-colors">
                                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-foreground truncate">{org.name}</h3>
                                        {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-0.5">{org.sector}</p>
                                    </div>
                                  </div>

                                  {/* Stats row */}
                                  <div className="flex items-center justify-between mb-2">
                                    <StarRating rating={org.seriousness} />
                                    <div className="flex items-center gap-3">
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

                                  {/* Next Best Action */}
                                  <div className="bg-secondary/40 rounded-md p-2">
                                    {editingAction === org.id ? (
                                      <div className="space-y-2" onClick={e => e.stopPropagation()}>
                                        <div className="flex items-center gap-1">
                                          <Input
                                            value={editActionValue}
                                            onChange={e => setEditActionValue(e.target.value)}
                                            placeholder="الخطوة القادمة..."
                                            className="h-7 text-xs bg-background border-border"
                                            autoFocus
                                            onKeyDown={e => e.key === 'Enter' && handleSaveNextAction(org.id)}
                                          />
                                          <button onClick={() => handleSaveNextAction(org.id)} className="p-1 rounded bg-success/20 hover:bg-success/30 shrink-0">
                                            <CheckIcon className="w-3 h-3 text-success" />
                                          </button>
                                          <button onClick={() => setEditingAction(null)} className="p-1 rounded bg-secondary hover:bg-destructive/20 shrink-0">
                                            <X className="w-3 h-3 text-muted-foreground" />
                                          </button>
                                        </div>
                                        <div className="flex items-center gap-1 flex-wrap">
                                          <UserCircle className="w-3 h-3 text-muted-foreground shrink-0" />
                                          {teamMembers.map(member => (
                                            <button
                                              key={member}
                                              type="button"
                                              onClick={() => setEditActionOwner(member)}
                                              className={`px-2 py-0.5 text-[10px] rounded-md border transition-colors ${
                                                editActionOwner === member
                                                  ? 'border-primary bg-primary/10 text-primary'
                                                  : 'border-border text-muted-foreground hover:border-primary/30'
                                              }`}
                                            >
                                              {member}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    ) : (
                                      <div
                                        className="flex items-center gap-1.5 group/action cursor-pointer"
                                        onClick={e => { e.stopPropagation(); setEditingAction(org.id); setEditActionValue(org.nextAction || ''); setEditActionOwner(org.actionOwner || teamMembers[0]); }}
                                      >
                                        <Zap className="w-3.5 h-3.5 text-warning shrink-0" />
                                        <div className="flex-1 min-w-0">
                                          {org.nextAction ? (
                                            <p className="text-xs text-warning/90 leading-relaxed">{org.nextAction}</p>
                                          ) : (
                                            <p className="text-xs text-muted-foreground/50 italic">أضف الخطوة القادمة...</p>
                                          )}
                                          {org.actionOwner && (
                                            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                                              <UserCircle className="w-3 h-3" /> {org.actionOwner}
                                            </span>
                                          )}
                                        </div>
                                        <Pencil className="w-3 h-3 text-muted-foreground/0 group-hover/action:text-muted-foreground/50 transition-colors shrink-0" />
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Expanded: Contacts + Opportunities */}
                                {isExpanded && (
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
                                )}
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </motion.div>
            );
          })}
        </div>
      </DragDropContext>

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
