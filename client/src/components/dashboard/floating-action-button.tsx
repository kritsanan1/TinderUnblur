import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Wand2, Bot, BarChart3 } from "lucide-react";

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  const quickActions = [
    { icon: Wand2, label: "Unblur Teasers", action: () => console.log("Unblur") },
    { icon: Bot, label: "Auto-Swipe", action: () => console.log("Auto-swipe") },
    { icon: BarChart3, label: "Analytics", action: () => console.log("Analytics") },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <div className="relative group">
        <Button
          size="icon"
          className="w-14 h-14 bg-gradient-to-br from-tinder-primary to-tinder-secondary text-white rounded-full shadow-lg hover:scale-110 transition-all duration-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Plus className={`h-6 w-6 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
        </Button>
        
        {/* Quick actions menu */}
        <div className={`absolute bottom-full right-0 mb-4 transition-all duration-300 space-y-3 ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}>
          {quickActions.map((action, index) => (
            <Button
              key={index}
              size="icon"
              variant="outline"
              className="w-12 h-12 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full shadow-lg hover:scale-110 transition-all duration-300 border border-gray-200 dark:border-gray-600"
              onClick={action.action}
              title={action.label}
            >
              <action.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
