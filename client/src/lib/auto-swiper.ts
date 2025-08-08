import { TinderAPI } from './tinder-api';

export interface SwipeDecision {
  action: 'like' | 'pass' | 'super_like';
  confidence: number;
  reasons: string[];
}

export interface AutoSwipeConfig {
  enabled: boolean;
  dailyLimit: number;
  swipeInterval: number; // seconds
  ageRange: [number, number];
  distanceLimit: number;
  filters: {
    verifiedOnly: boolean;
    photoQuality: boolean;
    bioRequired: boolean;
    educationLevel?: string;
    occupation?: string[];
  };
  strategy: 'conservative' | 'moderate' | 'aggressive';
}

export class AutoSwiper {
  private api: TinderAPI;
  private config: AutoSwipeConfig;
  private dailySwipeCount: number = 0;
  private isRunning: boolean = false;

  constructor(token: string, config: AutoSwipeConfig) {
    this.api = new TinderAPI(token);
    this.config = config;
  }

  private analyzeProfile(profile: any): SwipeDecision {
    const reasons: string[] = [];
    let score = 0;

    // Age filter
    if (profile.birth_date) {
      const age = this.calculateAge(profile.birth_date);
      if (age < this.config.ageRange[0] || age > this.config.ageRange[1]) {
        return { action: 'pass', confidence: 1.0, reasons: ['Age outside preferred range'] };
      }
      score += 10;
    }

    // Photo analysis
    if (profile.photos?.length >= 3) {
      score += 20;
      reasons.push('Good photo variety');
    } else if (profile.photos?.length < 2) {
      score -= 15;
      reasons.push('Limited photos');
    }

    // Bio analysis
    if (profile.bio?.length > 20) {
      score += 15;
      reasons.push('Has detailed bio');
    } else if (!profile.bio) {
      if (this.config.filters.bioRequired) {
        return { action: 'pass', confidence: 0.9, reasons: ['No bio (required)'] };
      }
      score -= 10;
    }

    // Verification check
    if (profile.verified) {
      score += 10;
      reasons.push('Verified profile');
    } else if (this.config.filters.verifiedOnly) {
      return { action: 'pass', confidence: 0.9, reasons: ['Not verified (required)'] };
    }

    // Distance check
    if (profile.distance_mi > this.config.distanceLimit) {
      score -= 20;
      reasons.push('Too far away');
    }

    // Education/occupation filters
    if (this.config.filters.educationLevel && profile.schools) {
      const hasEducation = profile.schools.some((school: any) => 
        school.name.toLowerCase().includes('university') || 
        school.name.toLowerCase().includes('college')
      );
      if (hasEducation) {
        score += 15;
        reasons.push('Higher education');
      }
    }

    // Strategy-based scoring
    const strategyMultiplier = {
      conservative: 0.7,
      moderate: 1.0,
      aggressive: 1.3
    }[this.config.strategy];

    score *= strategyMultiplier;

    // Final decision
    if (score >= 50) {
      return { 
        action: score >= 70 ? 'super_like' : 'like', 
        confidence: Math.min(score / 100, 1.0),
        reasons 
      };
    } else {
      return { 
        action: 'pass', 
        confidence: 1 - Math.min(score / 100, 1.0),
        reasons: reasons.length ? reasons : ['Low compatibility score']
      };
    }
  }

  private calculateAge(birthDate: string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  private async delay(seconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }

  async start(): Promise<void> {
    if (!this.config.enabled || this.isRunning) return;

    this.isRunning = true;
    this.dailySwipeCount = 0;

    try {
      while (this.isRunning && this.dailySwipeCount < this.config.dailyLimit) {
        // Get recommendations
        const recs = await this.api.getRecommendations();
        
        if (!recs?.data?.results?.length) {
          console.log('No more recommendations available');
          break;
        }

        for (const profile of recs.data.results) {
          if (this.dailySwipeCount >= this.config.dailyLimit) break;

          const decision = this.analyzeProfile(profile);
          
          // Execute swipe
          if (decision.action === 'super_like') {
            await this.api.superLike(profile._id);
          } else if (decision.action === 'like') {
            await this.api.swipe(profile._id, 'like');
          } else {
            await this.api.swipe(profile._id, 'pass');
          }

          this.dailySwipeCount++;
          
          // Log decision
          console.log(`Swiped ${decision.action} on ${profile.name} (${decision.confidence.toFixed(2)} confidence): ${decision.reasons.join(', ')}`);

          // Wait before next swipe
          await this.delay(this.config.swipeInterval);
        }
      }
    } catch (error) {
      console.error('Auto-swipe error:', error);
    } finally {
      this.isRunning = false;
    }
  }

  stop(): void {
    this.isRunning = false;
  }

  getStats(): { dailySwipeCount: number; isRunning: boolean } {
    return {
      dailySwipeCount: this.dailySwipeCount,
      isRunning: this.isRunning
    };
  }

  updateConfig(newConfig: Partial<AutoSwipeConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}