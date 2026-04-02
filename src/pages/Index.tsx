import { useState } from "react";
import CrmSidebar from "@/components/crm/Sidebar";
import Dashboard from "@/components/crm/Dashboard";
import PipelineView from "@/components/crm/PipelineView";
import PartnersView from "@/components/crm/PartnersView";
import ActivitiesView from "@/components/crm/ActivitiesView";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'pipeline': return <PipelineView />;
      case 'partners': return <PartnersView />;
      case 'activities': return <ActivitiesView />;
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
