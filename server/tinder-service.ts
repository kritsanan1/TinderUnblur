import { TinderAPI } from "../client/src/lib/tinder-api";
import { TinderUser, TinderRecommendationsResponse } from "../client/src/types/tinder";

export interface TinderServiceConfig {
  token?: string;
  appSessionId?: string;
  persistentDeviceId?: string;
  userSessionId?: string;
}

export class TinderService {
  private api: TinderAPI | null = null;

  constructor(private config: TinderServiceConfig = {}) {
    if (config.token) {
      this.api = new TinderAPI(config.token, {
        appSessionId: config.appSessionId,
        persistentDeviceId: config.persistentDeviceId,
        userSessionId: config.userSessionId,
      });
    }
  }

  setToken(token: string, options?: Omit<TinderServiceConfig, 'token'>) {
    this.api = new TinderAPI(token, options);
  }

  async getRecommendations(): Promise<TinderRecommendationsResponse | null> {
    if (!this.api) {
      return null;
    }

    try {
      return await this.api.getRecommendations();
    } catch (error) {
      console.error('Failed to fetch Tinder recommendations:', error);
      return null;
    }
  }

  async fetchTeasers() {
    if (!this.api) {
      return null;
    }

    try {
      return await this.api.fetchTeasers();
    } catch (error) {
      console.error('Failed to fetch Tinder teasers:', error);
      return null;
    }
  }

  async getProfile() {
    if (!this.api) {
      return null;
    }

    try {
      return await this.api.getProfile();
    } catch (error) {
      console.error('Failed to fetch Tinder profile:', error);
      return null;
    }
  }

  async performSwipe(userId: string, direction: 'like' | 'pass') {
    if (!this.api) {
      return null;
    }

    try {
      return await this.api.performSwipe(userId, direction);
    } catch (error) {
      console.error('Failed to perform swipe:', error);
      return null;
    }
  }

  async performSuperLike(userId: string) {
    if (!this.api) {
      return null;
    }

    try {
      return await this.api.performSuperLike(userId);
    } catch (error) {
      console.error('Failed to perform super like:', error);
      return null;
    }
  }

  async updateLocation(lat: number, lon: number) {
    if (!this.api) {
      return null;
    }

    try {
      return await this.api.updateLocation(lat, lon);
    } catch (error) {
      console.error('Failed to update location:', error);
      return null;
    }
  }

  async getAnalytics() {
    if (!this.api) {
      return null;
    }

    try {
      return await this.api.getAnalytics();
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      return null;
    }

    try {
      return await this.api.getProfile();
    } catch (error) {
      console.error('Failed to fetch Tinder profile:', error);
      return null;
    }
  }

  async getAnalytics() {
    if (!this.api) {
      return null;
    }

    try {
      return await this.api.getAnalytics();
    } catch (error) {
      console.error('Failed to fetch Tinder analytics:', error);
      return null;
    }
  }

  async performSwipe(userId: string, direction: 'like' | 'pass') {
    if (!this.api) {
      return null;
    }

    try {
      return await this.api.swipe(userId, direction);
    } catch (error) {
      console.error('Failed to perform swipe:', error);
      return null;
    }
  }

  async performSuperLike(userId: string) {
    if (!this.api) {
      return null;
    }

    try {
      return await this.api.superLike(userId);
    } catch (error) {
      console.error('Failed to perform super like:', error);
      return null;
    }
  }

  async updateLocation(lat: number, lon: number) {
    if (!this.api) {
      return null;
    }

    try {
      return await this.api.updateLocation(lat, lon);
    } catch (error) {
      console.error('Failed to update location:', error);
      return null;
    }
  }

  isConfigured(): boolean {
    return this.api !== null;
  }
}

// Export singleton instance
export const tinderService = new TinderService();