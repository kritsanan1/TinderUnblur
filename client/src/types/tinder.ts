export interface TinderUser {
  _id: string;
  name: string;
  bio?: string;
  photos: TinderPhoto[];
  birth_date: string;
  ping_time: string;
  distance_mi?: number;
}

export interface TinderPhoto {
  id: string;
  url: string;
  processedFiles: {
    url: string;
    width: number;
    height: number;
  }[];
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
