'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/utils/apiClient';
import MovieCard from '@/components/MovieCard';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  const [movies, setMovies] = useState([]); // State to hold movie data
  const [searchTerm, setSearchTerm] = useState(''); // State for search bar input

  useEffect(() => {
    // Fetch popular movies from TMDb API on component mount
    const fetchMovies = async () => {
      try {
        const response = await apiClient.get('/movie/popular');
        setMovies(response.data.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  // Filter movies based on search term
  const filteredMovies = movies.filter((movie: any) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar with Search Bar */}
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">
          {searchTerm ? `Search Results: "${searchTerm}"` : 'Popular Movies'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredMovies.map((movie: any) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </main>
    </div>
  );
}
