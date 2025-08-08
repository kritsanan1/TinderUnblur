import { TinderTeasersResponse, TinderRecommendationsResponse, TinderMatchResponse, TinderProfileResponse } from "@/types/tinder";

export class TinderAPI {
  private token: string;
  private appSessionId: string;
  private persistentDeviceId: string;
  private userSessionId: string;

  constructor(token: string, options?: {
    appSessionId?: string;
    persistentDeviceId?: string;
    userSessionId?: string;
  }) {
    this.token = token;
    this.appSessionId = options?.appSessionId || this.generateUUID();
    this.persistentDeviceId = options?.persistentDeviceId || this.generateUUID();
    this.userSessionId = options?.userSessionId || this.generateUUID();
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private getHeaders(): Record<string, string> {
    return {
      'Accept': 'application/json',
      'app-session-id': this.appSessionId,
      'app-session-time-elapsed': '',
      'app-version': '1020343',
      'Origin': 'https://tinder.com',
      'persistent-device-id': this.persistentDeviceId,
      'platform': 'web',
      'Referer': 'https://tinder.com/',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
      'user-session-id': this.userSessionId,
      'user-session-time-elapsed': '',
      'X-Auth-Token': this.token,
      'x-supported-image-formats': 'webp,jpeg'
    };
  }

  async fetchTeasers(): Promise<TinderTeasersResponse> {
    const response = await fetch("https://api.gotinder.com/v2/fast-match/teasers", {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Tinder API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getProfile(): Promise<TinderProfileResponse> {
    const response = await fetch("https://api.gotinder.com/profile", {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Tinder API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async swipe(userId: string, direction: "like" | "pass"): Promise<TinderMatchResponse> {
    const endpoint = direction === "like" ? "like" : "pass";
    const response = await fetch(`https://api.gotinder.com/${endpoint}/${userId}?locale=en`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Tinder API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getRecommendations(): Promise<TinderRecommendationsResponse> {
    const response = await fetch("https://api.gotinder.com/v2/recs/core?locale=en", {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Tinder API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async superLike(userId: string): Promise<TinderMatchResponse> {
    const response = await fetch(`https://api.gotinder.com/like/${userId}/super`, {
      method: "POST",
      headers: {
        ...this.getHeaders(),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Tinder API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getMatches(): Promise<any> {
    const response = await fetch("https://api.gotinder.com/v2/matches", {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Tinder API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async updateLocation(lat: number, lon: number): Promise<any> {
    const response = await fetch("https://api.gotinder.com/user/ping", {
      method: "POST",
      headers: {
        ...this.getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lat, lon }),
    });

    if (!response.ok) {
      throw new Error(`Tinder API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async refreshToken(refreshToken: string): Promise<any> {
    const response = await fetch("https://api.gotinder.com/v2/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "platform": "web",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      throw new Error(`Tinder API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getAnalytics(): Promise<any> {
    const response = await fetch("https://api.gotinder.com/v2/profile/analytics", {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Tinder API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}
