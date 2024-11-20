import { Movie } from '@/types/types';
import { Heart, Star } from 'lucide-react';
import Link from 'next/link';

interface MovieCardProps {
  movie: Movie;
  isFavorite: boolean;
  toggleFavorite: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, isFavorite, toggleFavorite }) => {
  return (
    <div className="relative group bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-all hover:scale-105">
      {/* Link to Movie Details */}
      <Link href={`/movies/${movie.id}`} passHref>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-72 object-cover"
        />
      </Link>
      <button
        onClick={() => toggleFavorite(movie)}
        className="absolute top-2 right-2 z-10"
      >
        <Heart
          color={isFavorite ? 'red' : 'white'}
          fill={isFavorite ? 'red' : 'transparent'}
          className="hover:scale-110 transition-all"
        />
      </button>
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-3 text-white">
        <h3 className="font-bold text-lg truncate">{movie.title}</h3>
        <div className="flex justify-between items-center">
          <span>{new Date(movie.release_date).getFullYear()}</span>
          <div className="flex items-center">
            <Star size={16} fill="yellow" color="yellow" className="mr-1" />
            {movie.vote_average.toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
