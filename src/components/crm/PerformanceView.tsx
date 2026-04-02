import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Clock, BarChart3, UserCircle, AlertTriangle, CheckCircle2, XCircle, Filter } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { mockActionLogs, mockOrganizations, lostOrganizations, salesStageLabels, salesStageColors, type SalesStage, type ActionLog } from "@/data/mockData";

const PIE_COLORS = ['#f97316', '#ef4444', '#eab308'];

const PerformanceView = () => {
  const [filterOwner, setFilterOwner] = useState<string | null>(null);
  const [filterStage, setFilterStage] = useState<SalesStage | null>(null);

  const allLogs = mockActionLogs;
  const filteredLogs = allLogs.filter(log => {
    if (filterOwner && log.owner !== filterOwner) return false;
    if (filterStage && log.fromStage !== filterStage) return false;
    return true;
  });

  const successLogs = filteredLogs.filter(l => l.outcome === 'success');
  const lostLogs = filteredLogs.filter(l => l.outcome === 'lost');
  const totalActions = filteredLogs.length;
  const conversionRate = totalActions > 0 ? Math.round((successLogs.length / totalActions) * 100) : 0;

  // Average days per stage transition
  const avgDays = successLogs.length > 0
    ? Math.round(successLogs.reduce((s, l) => s + (l.durationDays || 0), 0) / successLogs.length)
    : 0;

  // Losses by stage
  const lossByStage = (['contact', 'lead', 'opportunity'] as SalesStage[]).map(stage => ({
    stage,
    count: lostLogs.filter(l => l.fromStage === stage).length,
  }));

  // Team performance
  const owners = [...new Set(allLogs.map(l => l.owner))];
  const teamStats = owners.map(owner => {
    const ownerLogs = allLogs.filter(l => l.owner === owner);
    const wins = ownerLogs.filter(l => l.outcome === 'success').length;
    const losses = ownerLogs.filter(l => l.outcome === 'lost').length;
    const avgD = ownerLogs.filter(l => l.outcome === 'success' && l.durationDays).length > 0
      ? Math.round(ownerLogs.filter(l => l.outcome === 'success').reduce((s, l) => s + (l.durationDays || 0), 0) / ownerLogs.filter(l => l.outcome === 'success').length)
      : 0;
    return { owner, total: ownerLogs.length, wins, losses, rate: ownerLogs.length > 0 ? Math.round((wins / ownerLogs.length) * 100) : 0, avgDays: avgD };
  });

  const getOrgName = (orgId: string) => {
    return mockOrganizations.find(o => o.id === orgId)?.name || lostOrganizations[orgId] || orgId;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">تقارير الأداء</h2>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filterOwner || ''}
            onChange={e => setFilterOwner(e.target.value || null)}
            className="text-xs bg-secondary text-foreground border border-border rounded-lg px-2 py-1.5"
          >
            <option value="">كل الفريق</option>
            {owners.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <select
            value={filterStage || ''}
            onChange={e => setFilterStage((e.target.value as SalesStage) || null)}
            className="text-xs bg-secondary text-foreground border border-border rounded-lg px-2 py-1.5"
          >
            <option value="">كل المراحل</option>
            {(['contact', 'lead', 'opportunity'] as SalesStage[]).map(s => (
              <option key={s} value={s}>{salesStageLabels[s]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي الإجراءات', value: totalActions, icon: BarChart3, color: 'text-primary' },
          { label: 'نسبة التحويل', value: `${conversionRate}%`, icon: TrendingUp, color: 'text-success' },
          { label: 'الفرص المفقودة', value: lostLogs.length, icon: TrendingDown, color: 'text-destructive' },
          { label: 'متوسط الأيام بين المراحل', value: `${avgDays} يوم`, icon: Clock, color: 'text-warning' },
        ].map((stat, i) => {
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie Chart - Losses by Stage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="gradient-card border border-border rounded-xl p-5 shadow-card"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <h3 className="text-sm font-bold text-foreground">الخسائر حسب المرحلة</h3>
          </div>
          {lostLogs.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={lossByStage.filter(i => i.count > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="count"
                  nameKey="label"
                  label={({ label, count }) => `${label} (${count})`}
                  labelLine={false}
                >
                  {lossByStage.filter(i => i.count > 0).map((entry, idx) => (
                    <Cell key={entry.stage} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px', direction: 'rtl' }}
                  formatter={(value: number, name: string) => [`${value} خسارة`, name]}
                />
                <Legend
                  formatter={(value) => <span style={{ color: 'hsl(var(--foreground))', fontSize: '12px' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-10">لا توجد خسائر</p>
          )}
        </motion.div>

        {/* Bar Chart - Team Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="gradient-card border border-border rounded-xl p-5 shadow-card"
        >
          <div className="flex items-center gap-2 mb-4">
            <UserCircle className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">أداء الفريق</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={teamStats} layout="vertical" margin={{ right: 60, left: 10 }}>
              <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis type="category" dataKey="owner" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} width={80} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px', direction: 'rtl' }}
                formatter={(value: number, name: string) => [value, name === 'wins' ? 'نجاح' : 'خسارة']}
              />
              <Legend formatter={(value) => <span style={{ color: 'hsl(var(--foreground))', fontSize: '12px' }}>{value === 'wins' ? 'نجاح' : 'خسارة'}</span>} />
              <Bar dataKey="wins" fill="hsl(var(--success))" radius={[0, 4, 4, 0]} barSize={14} name="wins" />
              <Bar dataKey="losses" fill="hsl(var(--destructive))" radius={[0, 4, 4, 0]} barSize={14} name="losses" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Action Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="gradient-card border border-border rounded-xl p-5 shadow-card"
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">الجدول الزمني للإجراءات</h3>
        </div>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute right-[18px] top-0 bottom-0 w-0.5 bg-border" />
          
          <div className="space-y-4">
            {[...filteredLogs].sort((a, b) => b.date.localeCompare(a.date)).map((log, i) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.05 }}
                className="flex gap-4 relative"
              >
                {/* Dot */}
                <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center z-10 ${
                  log.outcome === 'success' ? 'bg-success/20' : log.outcome === 'lost' ? 'bg-destructive/20' : 'bg-warning/20'
                }`}>
                  {log.outcome === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  ) : log.outcome === 'lost' ? (
                    <XCircle className="w-4 h-4 text-destructive" />
                  ) : (
                    <Clock className="w-4 h-4 text-warning" />
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 bg-secondary/40 rounded-lg p-3 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{log.action}</span>
                    <span className="text-xs text-muted-foreground">{log.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    <span>{getOrgName(log.organizationId)}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <UserCircle className="w-3 h-3" /> {log.owner}
                    </span>
                    <span>·</span>
                    <span>{salesStageLabels[log.fromStage]}</span>
                    {log.toStage && (
                      <>
                        <span>←</span>
                        <span className="text-success">{salesStageLabels[log.toStage]}</span>
                      </>
                    )}
                    {log.durationDays !== undefined && log.durationDays > 0 && (
                      <>
                        <span>·</span>
                        <span className="text-warning">{log.durationDays} يوم</span>
                      </>
                    )}
                  </div>
                  {log.lossReason && (
                    <p className="text-xs text-destructive/80 mt-1.5 bg-destructive/5 rounded px-2 py-1">
                      سبب الخسارة: {log.lossReason}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PerformanceView;
