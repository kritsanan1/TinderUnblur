import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Percent, Eye, Star } from "lucide-react";
import { Analytics } from "@shared/schema";

interface StatsOverviewProps {
  userId: string;
}

export function StatsOverview({ userId }: StatsOverviewProps) {
  const { data: analytics, isLoading } = useQuery<Analytics>({
    queryKey: ["/api/analytics", userId],
  });

  if (isLoading) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-white dark:bg-gray-800 animate-pulse">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-xl mb-4"></div>
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </section>
    );
  }

  const stats = [
    {
      title: "Total Matches",
      value: analytics?.matches.toLocaleString() || "0",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: Heart,
      gradient: "from-tinder-primary to-pink-500",
    },
    {
      title: "Match Rate",
      value: `${((analytics?.matchRate || 0) / 100).toFixed(1)}%`,
      change: "+3.2%",
      changeType: "positive" as const,
      icon: Percent,
      gradient: "from-tinder-secondary to-yellow-500",
    },
    {
      title: "Profile Views",
      value: analytics?.profileViews.toLocaleString() || "0",
      change: "-2.1%",
      changeType: "negative" as const,
      icon: Eye,
      gradient: "from-tinder-accent to-blue-500",
    },
    {
      title: "Profile Score",
      value: analytics?.profileScore.toString() || "0",
      change: "Perfect",
      changeType: "perfect" as const,
      icon: Star,
      gradient: "from-purple-500 to-indigo-500",
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white dark:bg-gray-800 shadow-card border border-gray-100 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center`}>
                <stat.icon className="text-white h-5 w-5" />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-lg ${
                stat.changeType === "positive" 
                  ? "text-green-500 bg-green-50 dark:bg-green-900/20"
                  : stat.changeType === "negative"
                  ? "text-orange-500 bg-orange-50 dark:bg-orange-900/20"
                  : "text-green-500 bg-green-50 dark:bg-green-900/20"
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.title}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
