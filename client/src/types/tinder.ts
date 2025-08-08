export interface TinderUser {
  _id: string;
  name: string;
  bio?: string;
  photos: TinderPhoto[];
  birth_date: string;
  ping_time: string;
  distance_mi?: number;
  age?: number;
  gender?: number;
  schools?: any[];
  jobs?: any[];
  verified?: boolean;
}

export interface TinderPhoto {
  id: string;
  url: string;
  processedFiles: {
    url: string;
    width: number;
    height: number;
  }[];
  crop_info?: {
    processed_by_bullseye: boolean;
    user_customized: boolean;
  };
  fileName?: string;
  extension?: string;
}

export interface TinderTeaser {
  user: TinderUser;
  type: string;
}

export interface TinderTeasersResponse {
  data: {
    results: TinderTeaser[];
  };
}

export interface TinderRecommendationsResponse {
  meta: {
    status: number;
  };
  data: {
    results: {
      type: string;
      user: TinderUser;
    }[];
  };
}

export interface TinderMatchResponse {
  match: boolean;
  likes_remaining?: number;
  "X-Padding"?: string;
  rate_limited_until?: number;
  super_likes?: {
    remaining: number;
    alc_remaining: number;
    new_alc_remaining: number;
    allotment: number;
    superlike_reset_at: string;
    alc_superlike_reset_at: string;
  };
}

export interface TinderProfileResponse {
  _id: string;
  bio: string;
  birth_date: string;
  create_date: string;
  crm_id: string;
  email: string;
  full_name: string;
  gender: number;
  interested_in: number[];
  name: string;
  photos: TinderPhoto[];
  ping_time: string;
  pos: {
    lat: number;
    lon: number;
  };
  pos_info?: {
    country: {
      name: string;
      cc: string;
    };
    timezone: string;
  };
  purchases?: any[];
  travel?: any;
  tutorials_completed?: string[];
  blend?: string;
}
