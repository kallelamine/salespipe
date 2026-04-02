import { motion } from "framer-motion";
import { Phone, Mail, Calendar, CheckSquare, RotateCcw, Check, Presentation } from "lucide-react";
import { useActivities, useOrganizations, useUpdateActivity } from "@/hooks/useSupabaseData";

const typeIcons: Record<string, typeof Phone> = {
  call: Phone,
  meeting: Calendar,
  email: Mail,
  task: CheckSquare,
  followup: RotateCcw,
  presentation: Presentation,
};

const typeLabels: Record<string, string> = {
  call: 'اتصال',
  meeting: 'اجتماع',
  email: 'بريد',
  task: 'مهمة',
  followup: 'متابعة',
  presentation: 'عرض تقديمي',
};

const priorityColors: Record<string, string> = {
  high: 'border-r-destructive',
  medium: 'border-r-warning',
  low: 'border-r-muted-foreground',
};

const ActivitiesView = () => {
  const { data: activities = [] } = useActivities();
  const { data: organizations = [] } = useOrganizations();
  const updateActivity = useUpdateActivity();

  const getOrgName = (orgId: string) => {
    return organizations.find(o => o.id === orgId)?.name || orgId;
  };

  const pending = activities.filter(a => !a.completed);
  const completed = activities.filter(a => a.completed);

  const handleComplete = (id: string) => {
    updateActivity.mutate({ id, completed: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">المهام والأنشطة</h2>
        <button className="px-4 py-2 text-sm font-medium gradient-gold text-primary-foreground rounded-lg shadow-gold hover:opacity-90 transition-opacity">
          + مهمة جديدة
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-bold text-muted-foreground mb-3">قيد التنفيذ ({pending.length})</h3>
        {pending.map((activity, i) => {
          const Icon = typeIcons[activity.type] || CheckSquare;
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`gradient-card border border-border border-r-4 ${priorityColors[activity.priority]} rounded-lg p-4 shadow-card flex items-center gap-4`}
            >
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground truncate">{activity.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {typeLabels[activity.type]} · {getOrgName(activity.organization_id)} · {activity.due_date}
                </p>
              </div>
              <button
                onClick={() => handleComplete(activity.id)}
                className="p-2 rounded-md bg-secondary hover:bg-success/20 transition-colors shrink-0"
              >
                <Check className="w-4 h-4 text-muted-foreground" />
              </button>
            </motion.div>
          );
        })}
      </div>

      {completed.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-muted-foreground mb-3">مكتملة ({completed.length})</h3>
          {completed.map((activity) => {
            const Icon = typeIcons[activity.type] || CheckSquare;
            return (
              <div
                key={activity.id}
                className="gradient-card border border-border rounded-lg p-4 opacity-60 flex items-center gap-4"
              >
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground line-through truncate">{activity.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{getOrgName(activity.organization_id)}</p>
                </div>
                <Check className="w-4 h-4 text-success shrink-0" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivitiesView;
