'use client';

import { useState, useEffect } from 'react';
import MovieCard from '@/components/MovieCard';
import { Movie } from '@/types/types';
import Navbar from '@/components/Navbar';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); 

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
  }, []);


  const removeFavorite = (movie: Movie) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== movie.id);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

 
  const filteredFavorites = favorites.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Your Favorite Movies</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredFavorites.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={true}
              toggleFavorite={removeFavorite}
            />
          ))}
        </div>
        {filteredFavorites.length === 0 && (
          <p className="text-center text-gray-500">No favorite movies match your search.</p>
        )}
      </div>
    </div>
  );
}
