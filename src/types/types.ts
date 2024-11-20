
  export interface Cast {
    id: number;
    name: string;
    character: string;
  }
  export interface Genre {
    id: number;
    name: string;
  }
  export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
    overview?: string; // Make overview optional if not always present
    genres?: any[]; // Optional if not always used
  }
  