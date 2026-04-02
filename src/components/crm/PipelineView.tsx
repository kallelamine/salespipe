import { motion } from "framer-motion";
import { Phone, Mail, ArrowLeft } from "lucide-react";
import { mockContacts, stageLabels, stageColors, type ContactStage } from "@/data/mockData";

const stages: ContactStage[] = ['contact', 'lead', 'opportunity', 'project'];

const PipelineView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">مسار المبيعات</h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {stages.map((stage, i) => (
            <span key={stage} className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${stageColors[stage]}`} />
              {stageLabels[stage]}
              {i < stages.length - 1 && <ArrowLeft className="w-3 h-3 mx-1" />}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage, stageIndex) => {
          const stageContacts = mockContacts.filter(c => c.stage === stage);
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
                  <span className={`w-3 h-3 rounded-full ${stageColors[stage]}`} />
                  <span className="text-sm font-bold text-foreground">{stageLabels[stage]}</span>
                </div>
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                  {stageContacts.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-2">
                {stageContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="gradient-card border border-border rounded-lg p-4 shadow-card hover:border-primary/30 transition-colors cursor-pointer"
                  >
                    <h3 className="text-sm font-bold text-foreground mb-1">{contact.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{contact.company}</p>
                    {contact.value && (
                      <p className="text-sm font-bold text-primary mb-3">
                        {contact.value.toLocaleString()} ر.س
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-md bg-secondary hover:bg-secondary/80 transition-colors">
                        <Phone className="w-3 h-3 text-muted-foreground" />
                      </button>
                      <button className="p-1.5 rounded-md bg-secondary hover:bg-secondary/80 transition-colors">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineView;
