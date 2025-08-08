import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Activity } from "../../../../shared/schema";
import { Heart, TrendingUp, Bot, Wand2, MessageCircle } from "lucide-react";

interface ActivityFeedProps {
  userId: string;
}

export function ActivityFeed({ userId }: ActivityFeedProps) {
  const { data: activities = [], isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities", userId],
  });

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-card border border-gray-100 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "match":
        return Heart;
      case "optimization":
        return TrendingUp;
      case "auto_swipe":
        return Bot;
      case "unblur":
        return Wand2;
      default:
        return Heart;
    }
  };

  const getActivityGradient = (type: string) => {
    switch (type) {
      case "match":
        return "from-green-400 to-green-500";
      case "optimization":
        return "from-blue-400 to-blue-500";
      case "auto_swipe":
        return "from-purple-400 to-purple-500";
      case "unblur":
        return "from-orange-400 to-orange-500";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-card border border-gray-100 dark:border-gray-700">
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent Activity</h2>
          <Button variant="ghost" className="text-sm text-tinder-primary hover:text-tinder-secondary font-medium">
            View All
          </Button>
        </div>
      </div>
      
      <CardContent className="p-6">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Activity Yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Start using the app to see your activity here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              const gradient = getActivityGradient(activity.type);
              
              return (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors"
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center`}>
                    <Icon className="text-white text-sm" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.createdAt ? new Date(activity.createdAt).toLocaleString() : "Just now"}
                    </p>
                  </div>
                  {activity.type === "match" && (
                    <Button variant="ghost" size="sm" className="text-tinder-primary hover:text-tinder-secondary">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
