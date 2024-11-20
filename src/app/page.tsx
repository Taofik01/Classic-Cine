'use client';

import { useState, useEffect, useRef } from 'react';
import apiClient from '@/utils/apiClient';
import MovieCard from '@/components/MovieCard';
import Navbar from '@/components/Navbar';
import { Movie } from '@/types/types';

const Loader = () => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300"></div>
  </div>
);

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]); 
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [page, setPage] = useState<number>(1); 
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Movie[]>([]); 

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
  }, []);

  
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<{ results: Movie[] }>('/movie/popular', {
          params: { page },
        });
        setMovies((prevMovies) => [...prevMovies, ...response.data.results]);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [page]);

  // Set up Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setPage((prevPage) => prevPage + 1);
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, []);

  // Filter movies by search term
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

 
  const toggleFavorite = (movie: Movie) => {
    const isFavorite = favorites.some((fav) => fav.id === movie.id);
    const updatedFavorites = isFavorite
      ? favorites.filter((fav) => fav.id !== movie.id)
      : [...favorites, movie];

    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <div>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <main className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">
          {searchTerm ? `Search Results: "${searchTerm}"` : 'Popular Movies'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={favorites.some((fav) => fav.id === movie.id)}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>
        {isLoading && <Loader />}
        <div ref={loadMoreRef} />
      </main>
    </div>
  );
}
