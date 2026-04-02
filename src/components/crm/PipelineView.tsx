import { useState } from "react";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { Phone, Mail, ArrowLeft, Star, Plus, Users, ChevronDown, ChevronUp, X, Zap, Pencil, Check as CheckIcon, Building2, UserCircle, GripVertical, CheckCircle2, XCircle, LayoutGrid, List, ArrowUpDown } from "lucide-react";

import { salesStageLabels, salesStageColors, type SalesStage } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CsvImportDialog from "./CsvImportDialog";
import { useOrganizations, useContacts, useOpportunities, useCreateOrganization, useUpdateOrganization, useDeleteOrganization, useCreateContact, useCreateActionLog } from "@/hooks/useSupabaseData";

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

const PipelineView = ({ teamMembers }: PipelineViewProps) => {
  const { data: organizations = [] } = useOrganizations();
  const { data: contacts = [] } = useContacts();
  const { data: opportunities = [] } = useOpportunities();
  const createOrg = useCreateOrganization();
  const updateOrg = useUpdateOrganization();
  const deleteOrg = useDeleteOrganization();
  const createContact = useCreateContact();
  const createActionLog = useCreateActionLog();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [sortBy, setSortBy] = useState<'stage' | 'action' | 'owner' | 'seriousness'>('stage');
  const [expandedOrg, setExpandedOrg] = useState<string | null>(null);
  const [showAddOrg, setShowAddOrg] = useState(false);
  const [showAddContact, setShowAddContact] = useState<string | null>(null);
  const [editingAction, setEditingAction] = useState<string | null>(null);
  const [editActionValue, setEditActionValue] = useState('');
  const [editActionOwner, setEditActionOwner] = useState('');
  const [recordingOutcome, setRecordingOutcome] = useState<string | null>(null);
  const [lossReason, setLossReason] = useState('');

  const [newOrg, setNewOrg] = useState({ name: '', sector: '', stage: 'contact' as SalesStage, seriousness: 3, notes: '', nextAction: '', actionOwner: teamMembers[0] || '' });
  const [newContact, setNewContact] = useState({ name: '', role: '', email: '', phone: '', assignedTo: teamMembers[0] || '' });

  const handleSaveNextAction = (orgId: string) => {
    updateOrg.mutate({ id: orgId, next_action: editActionValue, action_owner_id: undefined });
    setEditingAction(null);
  };

  const handleRecordOutcome = (orgId: string, outcome: 'success' | 'lost') => {
    const org = organizations.find(o => o.id === orgId);
    if (!org) return;

    if (outcome === 'success') {
      const currentIdx = stages.indexOf(org.stage as SalesStage);
      const nextStage = currentIdx < stages.length - 1 ? stages[currentIdx + 1] : org.stage;
      createActionLog.mutate({
        action: org.next_action || '',
        from_stage: org.stage,
        to_stage: nextStage,
        outcome: 'success',
        organization_id: orgId,
        owner_id: org.action_owner_id,
      });
      updateOrg.mutate({ id: orgId, stage: nextStage, next_action: '', action_owner_id: null });
      setRecordingOutcome(null);
    } else {
      if (!lossReason.trim()) return;
      createActionLog.mutate({
        action: org.next_action || '',
        from_stage: org.stage,
        outcome: 'lost',
        organization_id: orgId,
        owner_id: org.action_owner_id,
        loss_reason: lossReason,
      });
      deleteOrg.mutate(orgId);
      setRecordingOutcome(null);
      setLossReason('');
    }
  };

  const handleDragEnd = (result: DropResult) => {
    const { draggableId, destination } = result;
    if (!destination) return;
    const newStage = destination.droppableId as SalesStage;
    const org = organizations.find(o => o.id === draggableId);
    if (org && org.stage !== newStage) {
      createActionLog.mutate({
        action: `نقل إلى ${salesStageLabels[newStage]}`,
        from_stage: org.stage,
        to_stage: newStage,
        outcome: 'success',
        organization_id: draggableId,
        owner_id: org.action_owner_id,
      });
      updateOrg.mutate({ id: draggableId, stage: newStage });
    }
  };

  const handleAddOrg = () => {
    if (!newOrg.name.trim()) return;
    createOrg.mutate({
      name: newOrg.name,
      sector: newOrg.sector,
      stage: newOrg.stage,
      seriousness: newOrg.seriousness,
      notes: newOrg.notes,
      next_action: newOrg.nextAction,
    });
    setNewOrg({ name: '', sector: '', stage: 'contact', seriousness: 3, notes: '', nextAction: '', actionOwner: teamMembers[0] || '' });
    setShowAddOrg(false);
  };

  const handleAddContact = (orgId: string) => {
    if (!newContact.name.trim()) return;
    createContact.mutate({
      organization_id: orgId,
      name: newContact.name,
      role: newContact.role,
      email: newContact.email,
      phone: newContact.phone,
    });
    setNewContact({ name: '', role: '', email: '', phone: '', assignedTo: teamMembers[0] || '' });
    setShowAddContact(null);
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-foreground">مسار المبيعات</h2>
          <div className="flex items-center bg-secondary rounded-lg p-0.5 border border-border">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'kanban' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              title="عرض البطاقات"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              title="عرض القائمة"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CsvImportDialog onImport={handleCsvImport} />
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
                <Button onClick={handleAddOrg} className="w-full gradient-gold text-primary-foreground shadow-gold" disabled={createOrg.isPending}>إضافة</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {viewMode === 'kanban' ? (
      <>
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
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${salesStageColors[stage]}`} />
                    <span className="text-sm font-bold text-foreground">{salesStageLabels[stage]}</span>
                  </div>
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                    {stageOrgs.length}
                  </span>
                </div>

                <Droppable droppableId={stage}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-2 min-h-[80px] rounded-lg p-1 transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5 border border-dashed border-primary/30' : ''}`}
                    >
                      {stageOrgs.map((org, index) => {
                        const orgContacts = contacts.filter(c => c.organization_id === org.id);
                        const orgOpportunities = opportunities.filter(o => o.organization_id === org.id);
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
                                <div
                                  className="p-4 cursor-pointer"
                                  onClick={() => setExpandedOrg(isExpanded ? null : org.id)}
                                >
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
                                    ) : recordingOutcome === org.id ? (
                                      <div className="space-y-2" onClick={e => e.stopPropagation()}>
                                        <p className="text-xs text-foreground mb-1">تسجيل نتيجة: <span className="text-warning">{org.next_action}</span></p>
                                        <button
                                          onClick={() => handleRecordOutcome(org.id, 'success')}
                                          className="w-full flex items-center justify-center gap-1 px-2 py-1.5 text-xs rounded-lg bg-success/10 border border-success/30 text-success hover:bg-success/20 transition-colors"
                                        >
                                          <CheckCircle2 className="w-3.5 h-3.5" /> نجاح - المرحلة التالية
                                        </button>
                                        <div className="space-y-1.5">
                                          <Input
                                            value={lossReason}
                                            onChange={e => setLossReason(e.target.value)}
                                            placeholder="سبب الخسارة..."
                                            className="h-7 text-xs bg-background border-border"
                                          />
                                          <button
                                            onClick={() => handleRecordOutcome(org.id, 'lost')}
                                            disabled={!lossReason.trim()}
                                            className="w-full flex items-center justify-center gap-1 px-2 py-1.5 text-xs rounded-lg bg-destructive/10 border border-destructive/30 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-40"
                                          >
                                            <XCircle className="w-3.5 h-3.5" /> خسارة
                                          </button>
                                        </div>
                                        <button onClick={() => { setRecordingOutcome(null); setLossReason(''); }} className="w-full text-[10px] text-muted-foreground hover:text-foreground">
                                          إلغاء
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1.5 group/action">
                                        <div
                                          className="flex items-center gap-1.5 flex-1 min-w-0 cursor-pointer"
                                          onClick={e => { e.stopPropagation(); setEditingAction(org.id); setEditActionValue(org.next_action || ''); setEditActionOwner(''); }}
                                        >
                                          <Zap className="w-3.5 h-3.5 text-warning shrink-0" />
                                          <div className="flex-1 min-w-0">
                                            {org.next_action ? (
                                              <p className="text-xs text-warning/90 leading-relaxed">{org.next_action}</p>
                                            ) : (
                                              <p className="text-xs text-muted-foreground/50 italic">أضف الخطوة القادمة...</p>
                                            )}
                                          </div>
                                          <Pencil className="w-3 h-3 text-muted-foreground/0 group-hover/action:text-muted-foreground/50 transition-colors shrink-0" />
                                        </div>
                                        {org.next_action && (
                                          <button
                                            onClick={e => { e.stopPropagation(); setRecordingOutcome(org.id); setLossReason(''); }}
                                            className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-colors shrink-0"
                                            title="تسجيل النتيجة"
                                          >
                                            <CheckIcon className="w-3 h-3 text-primary" />
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Expanded */}
                                {isExpanded && (
                                  <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
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
                                            <p className="text-[10px] text-muted-foreground">{contact.role}</p>
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
      </>
      ) : (
        /* List View */
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="gradient-card border border-border rounded-xl shadow-card overflow-hidden">
          <div className="flex items-center gap-2 p-4 border-b border-border bg-secondary/30">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">ترتيب حسب:</span>
            {([
              { key: 'stage', label: 'المرحلة' },
              { key: 'action', label: 'الخطوة القادمة' },
              { key: 'owner', label: 'الموظف' },
              { key: 'seriousness', label: 'الجدية' },
            ] as { key: typeof sortBy; label: string }[]).map(opt => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
                  sortBy === opt.key
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/30'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-[2fr_1fr_2fr_1fr_1fr] gap-2 px-4 py-2.5 border-b border-border text-xs font-bold text-muted-foreground bg-secondary/20">
            <span>الجهة</span>
            <span>المرحلة</span>
            <span>الخطوة القادمة</span>
            <span>المسؤول</span>
            <span>الجدية</span>
          </div>

          <div className="divide-y divide-border">
            {[...organizations]
              .sort((a, b) => {
                if (sortBy === 'stage') return stages.indexOf(a.stage as SalesStage) - stages.indexOf(b.stage as SalesStage);
                if (sortBy === 'action') return (a.next_action || '').localeCompare(b.next_action || '');
                if (sortBy === 'owner') return (a.action_owner_id || '').localeCompare(b.action_owner_id || '');
                if (sortBy === 'seriousness') return b.seriousness - a.seriousness;
                return 0;
              })
              .map(org => (
                <motion.div
                  key={org.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-[2fr_1fr_2fr_1fr_1fr] gap-2 px-4 py-3 items-center hover:bg-secondary/20 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{org.name}</p>
                    <p className="text-[10px] text-muted-foreground">{org.sector}</p>
                  </div>
                  <div>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-[10px] rounded-full font-medium ${salesStageColors[org.stage as SalesStage] || 'bg-secondary'} bg-secondary/60`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${salesStageColors[org.stage as SalesStage] || 'bg-secondary'}`} />
                      {salesStageLabels[org.stage as SalesStage] || org.stage}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-warning shrink-0" />
                    <span className="text-xs text-foreground/80 truncate">{org.next_action || <span className="text-muted-foreground/50 italic">—</span>}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <UserCircle className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-foreground">—</span>
                  </div>
                  <StarRating rating={org.seriousness} />
                </motion.div>
              ))}
          </div>
        </motion.div>
      )}

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
            <Button onClick={() => showAddContact && handleAddContact(showAddContact)} className="w-full gradient-gold text-primary-foreground shadow-gold" disabled={createContact.isPending}>
              إضافة
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PipelineView;
