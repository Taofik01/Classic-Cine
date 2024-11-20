export interface Genre {
    id: number;
    name: string;
  }
  
  export interface Cast {
    id: number;
    name: string;
    character: string;
  }
  
  export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
    overview: string;
    genres: Genre[]; 
    credits?: {
      cast: Cast[]; 
    };
  }
  