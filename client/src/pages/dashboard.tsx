import { useState } from "react";
import { TeaserUnblur } from "../components/dashboard/teaser-unblur";
import { ProfileOptimization } from "../components/dashboard/profile-optimization";
import { AutoSwipeSettings } from "../components/dashboard/auto-swipe-settings";
import { ActivityFeed } from "../components/dashboard/activity-feed";
import { FloatingActionButton } from "../components/dashboard/floating-action-button";
import { AdvancedAnalytics } from "../components/dashboard/advanced-analytics";
import { IntelligentAutoSwipe } from "../components/dashboard/intelligent-auto-swipe";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { 
  BarChart3, 
  Eye, 
  Bot, 
  Target, 
  Activity, 
  Brain,
  Settings,
  Zap,
  Heart,
  TrendingUp
} from "lucide-react";

export default function Dashboard() {
  const [currentView, setCurrentView] = useState("analytics");
  const userId = "demo-user-id";

  const views = [
    { 
      id: "analytics", 
      name: "Analytics", 
      icon: TrendingUp,
      description: "Advanced AI insights",
      component: <AdvancedAnalytics userId={userId} /> 
    },
    { 
      id: "auto-swipe", 
      name: "Auto-swipe", 
      icon: Brain,
      description: "Intelligent swiping",
      component: <IntelligentAutoSwipe userId={userId} /> 
    },
    { 
      id: "unblur", 
      name: "Unblur", 
      icon: Eye,
      description: "Teaser image reveals",
      component: <TeaserUnblur userId={userId} /> 
    },
    { 
      id: "optimization", 
      name: "Optimization", 
      icon: Target,
      description: "Profile enhancement",
      component: <ProfileOptimization userId={userId} /> 
    },
    { 
      id: "activity", 
      name: "Activity", 
      icon: Activity,
      description: "Recent actions log",
      component: <ActivityFeed userId={userId} /> 
    },
  ];

  const currentViewData = views.find(view => view.id === currentView);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Enhanced Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-tinder-primary to-tinder-secondary rounded-2xl">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Tinder Optimizer Pro
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Advanced AI-powered optimization for maximum Tinder success
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600 dark:text-gray-400">Live Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-gray-600 dark:text-gray-400">AI Enhanced</span>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-blue-500" />
              <span className="text-gray-600 dark:text-gray-400">Auto-Swipe Ready</span>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation */}
        <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {views.map((view) => (
                <Button
                  key={view.id}
                  onClick={() => setCurrentView(view.id)}
                  variant={currentView === view.id ? "default" : "outline"}
                  className={`h-auto p-4 flex flex-col items-center gap-3 transition-all duration-300 ${
                    currentView === view.id
                      ? "bg-gradient-to-r from-tinder-primary to-tinder-secondary text-white shadow-lg transform scale-105 border-none"
                      : "hover:scale-105 hover:shadow-md"
                  }`}
                >
                  <view.icon className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">{view.name}</div>
                    <div className="text-xs opacity-75 mt-1">{view.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current View Header */}
        {currentViewData && (
          <Card className="mb-6 bg-gradient-to-r from-tinder-primary/10 to-tinder-secondary/10 border border-tinder-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-tinder-primary to-tinder-secondary rounded-lg">
                  <currentViewData.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {currentViewData.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                    {currentViewData.description}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>
        )}

        {/* Main Content */}
        <div className="relative">
          {currentViewData?.component}
        </div>

        {/* Enhanced Footer */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>© 2025 Tinder Optimizer Pro - Enhance your dating experience with AI</p>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    API Status
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton />
      </div>
    </div>
  );
}
