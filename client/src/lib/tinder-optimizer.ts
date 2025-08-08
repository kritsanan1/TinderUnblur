export interface TinderProfile {
  photos: string[];
  bio: string;
  age: number;
  name: string;
  interests: string[];
  location: string;
}

export interface OptimizationSuggestion {
  category: 'photos' | 'bio' | 'timing' | 'behavior';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  action: string;
}

export interface SwipeAnalytics {
  totalSwipes: number;
  rightSwipes: number;
  leftSwipes: number;
  matches: number;
  matchRate: number;
  bestTimes: string[];
  photoPerformance: Record<string, number>;
}

export class TinderOptimizer {
  private analytics: SwipeAnalytics;

  constructor() {
    this.analytics = {
      totalSwipes: 0,
      rightSwipes: 0,
      leftSwipes: 0,
      matches: 0,
      matchRate: 0,
      bestTimes: [],
      photoPerformance: {}
    };
  }

  analyzeProfile(profile: TinderProfile): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];

    // Photo analysis
    if (profile.photos.length < 4) {
      suggestions.push({
        category: 'photos',
        priority: 'high',
        title: 'Add more photos',
        description: 'Profiles with 4-6 photos get 37% more matches',
        impact: '+37% matches',
        action: 'Upload 2-3 more high-quality photos'
      });
    }

    // Bio analysis
    if (profile.bio.length < 50) {
      suggestions.push({
        category: 'bio',
        priority: 'medium',
        title: 'Expand your bio',
        description: 'Longer bios (50-150 characters) show personality',
        impact: '+23% engagement',
        action: 'Add details about hobbies or interests'
      });
    }

    // Interest analysis
    if (profile.interests.length < 5) {
      suggestions.push({
        category: 'bio',
        priority: 'medium',
        title: 'Add more interests',
        description: 'More interests help with matching algorithm',
        impact: '+15% visibility',
        action: 'Select 3-5 additional interests'
      });
    }

    return suggestions;
  }

  getOptimalSwipeTimes(): string[] {
    // Based on Tinder usage data
    return [
      '8:00 PM - 10:00 PM (Peak activity)',
      '12:00 PM - 1:00 PM (Lunch break)',
      '6:00 PM - 8:00 PM (After work)',
      'Sunday 6:00 PM - 9:00 PM (Sunday evening)'
    ];
  }

  calculateBoostEffectiveness(currentMatches: number, avgMatches: number): number {
    return ((currentMatches - avgMatches) / avgMatches) * 100;
  }

  getLocationOptimization(currentLocation: string): string[] {
    const hotspots = [
      'University areas (Higher activity)',
      'Downtown/City center (Diverse users)',
      'Popular nightlife districts',
      'Coffee shop neighborhoods',
      'Fitness center areas'
    ];
    return hotspots;
  }

  generateSwipeStrategy(preferences: any): {
    rightSwipeRate: number;
    dailyLimit: number;
    timeWindows: string[];
    strategy: string;
  } {
    return {
      rightSwipeRate: 0.3, // 30% right swipe rate for optimal ELO
      dailyLimit: Math.min(preferences.dailyLimit || 50, 100),
      timeWindows: this.getOptimalSwipeTimes(),
      strategy: 'Conservative swiping maintains higher ELO score and better visibility'
    };
  }
}