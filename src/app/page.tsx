'use client';

import { useEffect, useRef, useState } from 'react';
import MovieCard from '@/components/MovieCard';
import apiClient from '@/utils/apiClient';
import { Movie } from '@/types/types';
import Navbar from '@/components/Navbar';
import {useAuthState} from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
// import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/utils/ProtectedRoute';


interface ApiMovie {
  id: number;
  title: string;
  poster_path?: string;
  release_date?: string;
  vote_average?: number;
  overview: string;
  genres?: string[];
}

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  
  const [ user ] = useAuthState(auth);

 

 


  
  // console.log('User:', user);
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get('/movie/popular', {
          params: { page },
        });
  
        const movies: Movie[] = response.data.results.map((movie: ApiMovie) => ({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          overview: movie.overview || '',
          genres: movie.genres || [],
        }));
  
        setMovies((prevMovies) => [...prevMovies, ...movies]);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchMovies();
  }, [page]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, []);

  const toggleFavorite = (movie: Movie) => {
    const isFavorite = favorites.some((fav) => fav.id === movie.id);
  
    const updatedFavorites = isFavorite
      ? favorites.filter((fav) => fav.id !== movie.id)
      : [...favorites, movie];
  
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ProtectedRoute>
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">
          {searchTerm ? `Search Results for "${searchTerm}"` : 'Popular Movies'}
        </h1>
        {
        // display username with a greeting with design and animation 
        <div className=''>Welcome {user?.displayName}!</div>
        }
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredMovies.map((movie, index) => (
            <MovieCard
              key={`${movie.id}-${index}`}
              movie={movie}
              onToggleFavorite={toggleFavorite}
              isFavorite={favorites.some((fav) => fav.id === movie.id)}
            />
          ))}
        </div>
        {isLoading && (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-300"></div>
          </div>
        )}
        <div ref={loadMoreRef} />
      </main>
      </ProtectedRoute>
    </div>
  );
}