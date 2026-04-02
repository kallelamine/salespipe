import StatsCards from "./StatsCards";
import { motion } from "framer-motion";
import { mockContacts, mockActivities, stageLabels, stageColors } from "@/data/mockData";
import { Clock, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const recentContacts = [...mockContacts].sort((a, b) => b.lastActivity.localeCompare(a.lastActivity)).slice(0, 4);
  const upcomingActivities = mockActivities.filter(a => !a.completed).slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">مرحباً بك 👋</h2>
        <p className="text-sm text-muted-foreground mt-1">لوحة تحكم تطوير الأعمال - التحول المبتكر</p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="gradient-card border border-border rounded-xl p-5 shadow-card"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">آخر التحديثات</h3>
          </div>
          <div className="space-y-3">
            {recentContacts.map(contact => (
              <div key={contact.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{contact.name}</p>
                  <p className="text-xs text-muted-foreground">{contact.company}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${stageColors[contact.stage]}/20 text-foreground`}>
                  {stageLabels[contact.stage]}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="gradient-card border border-border rounded-xl p-5 shadow-card"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">المهام القادمة</h3>
          </div>
          <div className="space-y-3">
            {upcomingActivities.map(activity => (
              <div key={activity.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.dueDate}</p>
                </div>
                <span className={`w-2 h-2 rounded-full ${
                  activity.priority === 'high' ? 'bg-destructive' : activity.priority === 'medium' ? 'bg-warning' : 'bg-muted-foreground'
                }`} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
