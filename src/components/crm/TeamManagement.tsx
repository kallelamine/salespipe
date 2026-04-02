import { useState } from "react";
import { Plus, X, Users, UserPlus, Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTeamMembers, useCreateTeamMember, useDeleteTeamMember } from "@/hooks/useSupabaseData";

const TeamManagement = () => {
  const { data: members = [] } = useTeamMembers();
  const createMember = useCreateTeamMember();
  const deleteMember = useDeleteTeamMember();
  const [newMember, setNewMember] = useState('');
  const [csvResult, setCsvResult] = useState<{ count: number; names: string[] } | null>(null);
  const [csvError, setCsvError] = useState('');

  const handleAdd = () => {
    const name = newMember.trim();
    if (!name || members.some(m => m.name === name)) return;
    createMember.mutate({ name });
    setNewMember('');
  };

  const handleRemove = (id: string) => {
    deleteMember.mutate(id);
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvError('');
    setCsvResult(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const lines = text.split(/\r?\n/).filter(l => l.trim());
        const names: string[] = [];
        const existingNames = members.map(m => m.name);
        for (const line of lines) {
          const cols = line.split(',').map(c => c.replace(/"/g, '').trim());
          for (const col of cols) {
            if (col && !existingNames.includes(col) && !names.includes(col)) {
              names.push(col);
            }
          }
        }
        if (names.length === 0) { setCsvError('لم يتم العثور على أسماء جديدة'); return; }
        names.forEach(name => createMember.mutate({ name }));
        setCsvResult({ count: names.length, names });
      } catch {
        setCsvError('حدث خطأ في قراءة الملف');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">إدارة الفريق</h2>
      </div>

      {/* Add member */}
      <div className="gradient-card border border-border rounded-lg p-5 space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-primary" />
          إضافة عضو جديد
        </h3>
        <div className="flex gap-2">
          <Input
            value={newMember}
            onChange={e => setNewMember(e.target.value)}
            placeholder="اسم العضو..."
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <Button onClick={handleAdd} className="gradient-gold text-primary-foreground shadow-gold shrink-0" disabled={createMember.isPending}>
            <Plus className="w-4 h-4" />
            إضافة
          </Button>
        </div>

        {/* CSV upload */}
        <div className="border-t border-border pt-4">
          <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Upload className="w-4 h-4" />
            أو استيراد من ملف CSV
          </label>
          <label className="block border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/30 transition-colors">
            <FileSpreadsheet className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">اضغط لاختيار ملف</p>
            <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
          </label>
          {csvError && (
            <div className="flex items-center gap-2 text-destructive text-xs mt-2">
              <AlertCircle className="w-3 h-3" /> {csvError}
            </div>
          )}
          {csvResult && (
            <div className="flex items-center gap-2 text-success text-xs mt-2">
              <CheckCircle2 className="w-3 h-3" /> تمت إضافة {csvResult.count} عضو
            </div>
          )}
        </div>
      </div>

      {/* Members list */}
      <div className="gradient-card border border-border rounded-lg p-5 space-y-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          أعضاء الفريق ({members.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {members.map(member => (
            <div key={member.id} className="flex items-center justify-between bg-secondary/40 rounded-lg px-3 py-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{member.name[0]}</span>
                </div>
                <div>
                  <span className="text-sm text-foreground">{member.name}</span>
                  {member.role && <p className="text-[10px] text-muted-foreground">{member.role}</p>}
                </div>
              </div>
              <button onClick={() => handleRemove(member.id)} className="p-1 rounded hover:bg-destructive/20 transition-colors">
                <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
