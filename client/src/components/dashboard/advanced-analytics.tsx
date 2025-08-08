import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { TrendingUp, Users, Heart, Zap, MapPin, Clock } from "lucide-react";
import { Analytics } from "../../../../shared/schema";
import { ErrorBoundary } from "../ErrorBoundary";

interface AdvancedAnalyticsProps {
  userId: string;
}

export function AdvancedAnalytics({ userId }: AdvancedAnalyticsProps) {
  const { data: analytics } = useQuery<Analytics>({
    queryKey: ["/api/analytics", userId],
  });

  const matchRate = ((analytics?.matchRate || 0) / 100).toFixed(1);
  const profileScore = analytics?.profileScore || 0;

  const metrics = [
    {
      title: "ELO Score Estimate",
      value: Math.floor(1200 + (profileScore * 8)),
      change: "+47 this week",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
      description: "Your attractiveness ranking"
    },
    {
      title: "Peak Activity Time",
      value: "8:30 PM",
      change: "Sunday-Thursday",
      icon: Clock,
      color: "from-purple-500 to-pink-500",
      description: "Best time for maximum visibility"
    },
    {
      title: "Location Hotspots",
      value: "3 Active",
      change: "Downtown, University",
      icon: MapPin,
      color: "from-green-500 to-emerald-500",
      description: "High-activity areas near you"
    },
    {
      title: "Boost Effectiveness",
      value: "312%",
      change: "vs normal times",
      icon: Zap,
      color: "from-orange-500 to-red-500",
      description: "Boost performance increase"
    }
  ];

  const weeklyData = [
    { day: 'Mon', matches: 3, views: 45, swipes: 67 },
    { day: 'Tue', matches: 5, views: 52, swipes: 73 },
    { day: 'Wed', matches: 2, views: 38, swipes: 54 },
    { day: 'Thu', matches: 7, views: 61, swipes: 82 },
    { day: 'Fri', matches: 9, views: 78, swipes: 95 },
    { day: 'Sat', matches: 12, views: 94, swipes: 87 },
    { day: 'Sun', matches: 8, views: 67, swipes: 76 }
  ];

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Advanced Metrics Grid */}</div>
    </ErrorBoundary>
  );
}

function AdvancedAnalyticsContent({ userId }: AdvancedAnalyticsProps) {
  const { data: analytics } = useQuery<Analytics>({
    queryKey: ["/api/analytics", userId],
  });

  const matchRate = ((analytics?.matchRate || 0) / 100).toFixed(1);
  const profileScore = analytics?.profileScore || 0;

  const metrics = [
    {
      title: "ELO Score Estimate",
      value: Math.floor(1200 + (profileScore * 8)),
      change: "+47 this week",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
      description: "Your attractiveness ranking"
    },
    {
      title: "Peak Activity Time",
      value: "8:30 PM",
      change: "Sunday-Thursday",
      icon: Clock,
      color: "from-purple-500 to-pink-500",
      description: "Best time for maximum visibility"
    },
    {
      title: "Location Hotspots",
      value: "3 Active",
      change: "Downtown, University",
      icon: MapPin,
      color: "from-green-500 to-emerald-500",
      description: "High-activity areas near you"
    },
    {
      title: "Boost Effectiveness",
      value: "312%",
      change: "vs normal times",
      icon: Zap,
      color: "from-orange-500 to-red-500",
      description: "Boost performance increase"
    }
  ];

  const weeklyData = [
    { day: "Mon", matches: 12, views: 89, likes: 34 },
    { day: "Tue", matches: 8, views: 67, likes: 28 },
    { day: "Wed", matches: 15, views: 124, likes: 45 },
    { day: "Thu", matches: 11, views: 93, likes: 31 },
    { day: "Fri", matches: 18, views: 156, likes: 52 },
    { day: "Sat", matches: 22, views: 187, likes: 68 },
    { day: "Sun", matches: 16, views: 134, likes: 41 },
  ];

  return (
    <div className="space-y-6">
      {/* Advanced Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-5`}></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${metric.color}`}>
                  <metric.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{metric.change}</div>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{metric.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Chart */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-tinder-primary" />
            Weekly Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyData.map((day, index) => (
              <div key={day.day} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">
                  {day.day}
                </div>
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Matches</span>
                      <span>{day.matches}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-tinder-primary to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(day.matches / 15) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Views</span>
                      <span>{day.views}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(day.views / 100) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Swipes</span>
                      <span>{day.swipes}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(day.swipes / 100) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="bg-gradient-to-br from-tinder-primary/10 to-tinder-secondary/10 border border-tinder-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-tinder-primary">
            <Heart className="h-5 w-5" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">Optimization Recommendations</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Boost usage at 8:30 PM increases matches by 47%</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Your second photo performs 23% better as primary</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Adding interests in "Travel" category boosts matches</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">Behavioral Patterns</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>You're most active on weekends (optimal timing)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Your swipe selectivity improved match quality</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Location changes correlate with 31% more views</span>
                </li>
              </ul>
            </div>
          </div>

          <Button className="w-full mt-4 bg-gradient-to-r from-tinder-primary to-tinder-secondary text-white hover:scale-105 transition-transform">
            <Users className="mr-2 h-4 w-4" />
            View Detailed Analytics Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}