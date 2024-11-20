'use client';

import { useEffect, useState } from 'react';
import MovieCard from '@/components/MovieCard';
import { Movie } from '@/types/types';
import Navbar from '@/components/Navbar';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    // Load favorites from localStorage
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
  }, []);

  const toggleFavorite = (movie: Movie) => {
    const isFavorite = favorites.some((fav) => fav.id === movie.id);
  
    const updatedFavorites = isFavorite
      ? favorites.filter((fav) => fav.id !== movie.id) // Remove favorite
      : [...favorites, movie]; // Add favorite
  
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };
  return (
    <div>
      <Navbar disableSearchBar={true} />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Your Favorite Movies</h1>
        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {favorites.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie} 
                onToggleFavorite={toggleFavorite as (movie: Movie) => void}
                isFavorite={favorites.some((fav) => fav.id === movie.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No favorite movies yet.</p>
        )}
      </main>
    </div>
  );
}
