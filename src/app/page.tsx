'use client';

import { useEffect, useRef, useState } from 'react';
import MovieCard from '@/components/MovieCard';
import apiClient from '@/utils/apiClient';
import { Movie } from '@/types/types';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1); // Current page for infinite scrolling
  const [isLoading, setIsLoading] = useState<boolean>(false); // Show loader when fetching data

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get('/movie/popular', {
          params: { page },
        });
  
        const movies: Movie[] = response.data.results.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          overview: movie.overview || '', // Ensure overview is always present
          genres: movie.genres || [], // Provide default value for genres
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
    // Load favorites from localStorage
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
  }, []);

  useEffect(() => {
    // Setup IntersectionObserver for infinite scrolling
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1); // Increment the page when the observer is triggered
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => observer.disconnect(); // Cleanup observer on component unmount
  }, []);

  const toggleFavorite = (movie: Movie) => {
    const isFavorite = favorites.some((fav) => fav.id === movie.id);
  
    const updatedFavorites = isFavorite
      ? favorites.filter((fav) => fav.id !== movie.id) // Remove favorite
      : [...favorites, movie]; // Add favorite
  
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };
  

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">
          {searchTerm ? `Search Results for "${searchTerm}"` : 'Popular Movies'}
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
  {filteredMovies.map((movie, index) => (
  // @ts-ignore
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
        {/* Div to track for infinite scrolling */}
        <div ref={loadMoreRef} />
      </main>
    </div>
  );
}
