import { AppHeader } from "@/components/dashboard/app-header";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { TeaserUnblur } from "@/components/dashboard/teaser-unblur";
import { ProfileOptimization } from "@/components/dashboard/profile-optimization";
import { AutoSwipeSettings } from "@/components/dashboard/auto-swipe-settings";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { FloatingActionButton } from "@/components/dashboard/floating-action-button";

export default function Dashboard() {
  // Mock user ID for demo - in real app this would come from auth
  const userId = "demo-user-id";

  return (
    <div className="min-h-screen bg-white dark:bg-tinder-dark text-gray-900 dark:text-white transition-colors duration-300">
      <AppHeader />
      
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <StatsOverview userId={userId} />
        <TeaserUnblur userId={userId} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProfileOptimization />
          <AutoSwipeSettings userId={userId} />
        </div>
        
        <ActivityFeed userId={userId} />
      </main>
      
      <FloatingActionButton />
    </div>
  );
}
