import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Organization, SalesStage } from "@/data/mockData";

interface CsvImportDialogProps {
  onImport: (orgs: Organization[]) => void;
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

const CsvImportDialog = ({ onImport }: CsvImportDialogProps) => {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<Organization[]>([]);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

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
        const actionOwnerIdx = headers.findIndex(h => ['actionowner', 'action owner', 'المسؤول', 'مسؤول'].includes(h));

        if (nameIdx === -1) { setError('لم يتم العثور على عمود "الاسم" أو "name" في الملف'); return; }

        const orgs: Organization[] = lines.slice(1).map((line, i) => {
          const cols = parseCsvLine(line);
          return {
            id: `csv_${Date.now()}_${i}`,
            name: cols[nameIdx] || '',
            sector: sectorIdx >= 0 ? cols[sectorIdx] || '' : '',
            stage: stageIdx >= 0 ? (stageMap[cols[stageIdx]?.trim()] || 'contact') : 'contact',
            seriousness: seriousnessIdx >= 0 ? Math.min(5, Math.max(1, parseInt(cols[seriousnessIdx]) || 1)) : 1,
            notes: notesIdx >= 0 ? cols[notesIdx] : undefined,
            nextAction: nextActionIdx >= 0 ? cols[nextActionIdx] : undefined,
            actionOwner: actionOwnerIdx >= 0 ? cols[actionOwnerIdx] : undefined,
            createdAt: new Date().toISOString().split('T')[0],
          };
        }).filter(o => o.name.trim());

        setPreview(orgs);
      } catch {
        setError('حدث خطأ في قراءة الملف');
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    onImport(preview);
    setPreview([]);
    setFileName('');
    setOpen(false);
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
            <p>الاسم (مطلوب) · القطاع · المرحلة · الجدية (1-5) · ملاحظات · الخطوة القادمة · المسؤول</p>
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
              <div className="flex items-center gap-2 text-success text-xs">
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
              <Button onClick={handleImport} className="w-full gradient-gold text-primary-foreground shadow-gold">
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
