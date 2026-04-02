import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type SalesStage = 'contact' | 'lead' | 'opportunity' | 'project';

interface ParsedOrg {
  name: string;
  sector: string;
  stage: SalesStage;
  seriousness: number;
  notes: string;
  next_action: string;
}

const stageMap: Record<string, SalesStage> = {
  'تواصل': 'contact',
  'عميل محتمل': 'lead',
  'فرصة': 'opportunity',
  'مشروع': 'project',
  'contact': 'contact',
  'lead': 'lead',
  'opportunity': 'opportunity',
  'project': 'project',
};

const parseCsvLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (const char of line) {
    if (char === '"') { inQuotes = !inQuotes; }
    else if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
    else { current += char; }
  }
  result.push(current.trim());
  return result;
};

const CsvImportDialog = () => {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<ParsedOrg[]>([]);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [importing, setImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setError('');

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const lines = text.split(/\r?\n/).filter(l => l.trim());
        if (lines.length < 2) { setError('الملف فارغ أو لا يحتوي على بيانات'); return; }

        const headers = parseCsvLine(lines[0]).map(h => h.toLowerCase().trim());
        const nameIdx = headers.findIndex(h => ['name', 'اسم', 'الاسم', 'اسم الجهة'].includes(h));
        const sectorIdx = headers.findIndex(h => ['sector', 'القطاع', 'قطاع'].includes(h));
        const stageIdx = headers.findIndex(h => ['stage', 'المرحلة', 'مرحلة'].includes(h));
        const seriousnessIdx = headers.findIndex(h => ['seriousness', 'الجدية', 'جدية'].includes(h));
        const notesIdx = headers.findIndex(h => ['notes', 'ملاحظات'].includes(h));
        const nextActionIdx = headers.findIndex(h => ['nextaction', 'next action', 'الخطوة القادمة', 'خطوة'].includes(h));

        if (nameIdx === -1) { setError('لم يتم العثور على عمود "الاسم" أو "name" في الملف'); return; }

        const orgs: ParsedOrg[] = lines.slice(1).map((line) => {
          const cols = parseCsvLine(line);
          return {
            name: cols[nameIdx] || '',
            sector: sectorIdx >= 0 ? cols[sectorIdx] || '' : '',
            stage: stageIdx >= 0 ? (stageMap[cols[stageIdx]?.trim()] || 'contact') : 'contact',
            seriousness: seriousnessIdx >= 0 ? Math.min(5, Math.max(1, parseInt(cols[seriousnessIdx]) || 3)) : 3,
            notes: notesIdx >= 0 ? cols[notesIdx] || '' : '',
            next_action: nextActionIdx >= 0 ? cols[nextActionIdx] || '' : '',
          };
        }).filter(o => o.name.trim());

        setPreview(orgs);
      } catch {
        setError('حدث خطأ في قراءة الملف');
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    setImporting(true);
    try {
      const rows = preview.map(org => ({
        name: org.name,
        sector: org.sector,
        stage: org.stage,
        seriousness: org.seriousness,
        notes: org.notes,
        next_action: org.next_action,
      }));

      const { error } = await supabase.from("organizations").insert(rows);
      if (error) throw error;

      qc.invalidateQueries({ queryKey: ["organizations"] });
      toast.success(`تم استيراد ${preview.length} جهة بنجاح`);
      setPreview([]);
      setFileName('');
      setOpen(false);
    } catch (err: any) {
      toast.error("خطأ في الاستيراد: " + (err.message || "حدث خطأ"));
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setPreview([]); setError(''); setFileName(''); } }}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="border-border text-muted-foreground hover:text-foreground">
          <Upload className="w-4 h-4" />
          استيراد CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">استيراد جهات من ملف CSV</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="text-xs text-muted-foreground bg-secondary/50 rounded-lg p-3 space-y-1">
            <p className="font-bold text-foreground mb-1">الأعمدة المدعومة:</p>
            <p>الاسم (مطلوب) · القطاع · المرحلة · الجدية (1-5) · ملاحظات · الخطوة القادمة</p>
            <p className="mt-1">يمكن استخدام الأسماء بالعربية أو الإنجليزية</p>
          </div>

          <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/30 transition-colors"
          >
            <FileSpreadsheet className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {fileName || 'اضغط لاختيار ملف CSV'}
            </p>
          </button>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-xs bg-destructive/10 rounded-lg p-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {preview.length > 0 && (
            <>
              <div className="flex items-center gap-2 text-emerald-400 text-xs">
                <CheckCircle2 className="w-4 h-4" />
                تم قراءة {preview.length} جهة بنجاح
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {preview.map((org, i) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-secondary/30 rounded p-2">
                    <span className="text-foreground font-medium">{org.name}</span>
                    <span className="text-muted-foreground">{org.sector}</span>
                  </div>
                ))}
              </div>
              <Button onClick={handleImport} disabled={importing} className="w-full gradient-gold text-primary-foreground shadow-gold">
                {importing ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : null}
                استيراد {preview.length} جهة
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CsvImportDialog;
