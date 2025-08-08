import { TinderTeasersResponse } from "@/types/tinder";

export class TinderAPI {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async fetchTeasers(): Promise<TinderTeasersResponse> {
    const response = await fetch("https://api.gotinder.com/v2/fast-match/teasers", {
      headers: {
        "X-Auth-Token": this.token,
        platform: "android",
      },
    });

    if (!response.ok) {
      throw new Error(`Tinder API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getProfile(): Promise<any> {
    const response = await fetch("https://api.gotinder.com/profile", {
      headers: {
        "X-Auth-Token": this.token,
        platform: "android",
      },
    });

    if (!response.ok) {
      throw new Error(`Tinder API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async swipe(userId: string, direction: "like" | "pass"): Promise<any> {
    const endpoint = direction === "like" ? "like" : "pass";
    const response = await fetch(`https://api.gotinder.com/${endpoint}/${userId}`, {
      method: "GET",
      headers: {
        "X-Auth-Token": this.token,
        platform: "android",
      },
    });

    if (!response.ok) {
      throw new Error(`Tinder API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getRecommendations(): Promise<any> {
    const response = await fetch("https://api.gotinder.com/v2/recs/core", {
      headers: {
        "X-Auth-Token": this.token,
        platform: "android",
      },
    });

    if (!response.ok) {
      throw new Error(`Tinder API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async superLike(userId: string): Promise<any> {
    const response = await fetch(`https://api.gotinder.com/like/${userId}/super`, {
      method: "POST",
      headers: {
        "X-Auth-Token": this.token,
        platform: "android",
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
      headers: {
        "X-Auth-Token": this.token,
        platform: "android",
      },
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
        "X-Auth-Token": this.token,
        platform: "android",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lat, lon }),
    });

    if (!response.ok) {
      throw new Error(`Tinder API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}
