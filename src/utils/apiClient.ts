import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY, // Add this key to your `.env.local`
  },
});

export default apiClient;
