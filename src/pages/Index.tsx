import { useState } from "react";
import CrmSidebar from "@/components/crm/Sidebar";
import Dashboard from "@/components/crm/Dashboard";
import PipelineView from "@/components/crm/PipelineView";
import PartnersView from "@/components/crm/PartnersView";
import ActivitiesView from "@/components/crm/ActivitiesView";
import TeamManagement from "@/components/crm/TeamManagement";
import { teamMembers as defaultTeamMembers } from "@/data/mockData";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [teamMembers, setTeamMembers] = useState(defaultTeamMembers);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'pipeline': return <PipelineView teamMembers={teamMembers} />;
      case 'partners': return <PartnersView />;
      case 'activities': return <ActivitiesView />;
      case 'team': return <TeamManagement members={teamMembers} onUpdate={setTeamMembers} />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <CrmSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
