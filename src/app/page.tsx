'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/utils/apiClient';
import MovieCard from '@/components/MovieCard';
import Navbar from '@/components/Navbar';
import { Movie } from '@/types/types';

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]); // Typed state for movies
  const [searchTerm, setSearchTerm] = useState<string>(''); // Typed state for search term

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await apiClient.get<{ results: Movie[] }>('/movie/popular');
        setMovies(response.data.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <main className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">
          {searchTerm ? `Search Results: "${searchTerm}"` : 'Popular Movies'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </main>
    </div>
  );
}
