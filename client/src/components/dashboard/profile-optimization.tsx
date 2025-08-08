import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";

export function ProfileOptimization() {
  const suggestions = [
    {
      type: "success",
      title: "Great photo variety",
      description: "Your photos show different activities and angles",
      icon: CheckCircle,
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
      iconColor: "bg-green-500",
      textColor: "text-green-800 dark:text-green-200",
      descColor: "text-green-700 dark:text-green-300",
    },
    {
      type: "warning",
      title: "Bio could be longer",
      description: "Add more personality to stand out",
      icon: AlertTriangle,
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800",
      iconColor: "bg-orange-500",
      textColor: "text-orange-800 dark:text-orange-200",
      descColor: "text-orange-700 dark:text-orange-300",
    },
    {
      type: "info",
      title: "Peak activity time",
      description: "Best time to swipe: 8-10 PM on weekends",
      icon: Lightbulb,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      iconColor: "bg-blue-500",
      textColor: "text-blue-800 dark:text-blue-200",
      descColor: "text-blue-700 dark:text-blue-300",
    },
  ];

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-card border border-gray-100 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Profile Optimization</h2>
          <span className="text-sm bg-tinder-primary/10 text-tinder-primary px-3 py-1 rounded-lg font-medium">
            Score: 92/100
          </span>
        </div>
        
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 p-4 ${suggestion.bgColor} rounded-xl border ${suggestion.borderColor}`}
            >
              <div className={`w-6 h-6 ${suggestion.iconColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                <suggestion.icon className="text-white text-sm" />
              </div>
              <div>
                <h4 className={`font-medium ${suggestion.textColor}`}>{suggestion.title}</h4>
                <p className={`text-sm ${suggestion.descColor} mt-1`}>{suggestion.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <Button className="w-full mt-6 bg-gradient-to-r from-tinder-primary to-tinder-secondary text-white hover:scale-105 transition-transform duration-300 shadow-button">
          View Full Analysis
        </Button>
      </CardContent>
    </Card>
  );
}
