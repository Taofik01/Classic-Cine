import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Movie } from '@/types/types';

interface MovieCardProps {
  movie: Movie;
  onToggleFavorite: (movie: Movie) => void;
  isFavorite: boolean;
}

export default function MovieCard({ movie, onToggleFavorite, isFavorite }: MovieCardProps) {
  return (
    <div className="relative group bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <Link href={`/movies/${movie.id}`}>
        <div className="relative aspect-[2/3]">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          onToggleFavorite(movie);
        }}
        className="absolute top-2 right-2 z-10 p-2 hover:scale-110 transition-transform"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className="transition-colors"
          color={isFavorite ? 'red' : 'white'}
          fill={isFavorite ? 'red' : 'none'}
        />
      </button>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <h3 className="font-bold text-lg text-white truncate">{movie.title}</h3>
        <div className="flex justify-between items-center text-gray-300 text-sm">
          <span>{new Date(movie.release_date).getFullYear()}</span>
          <span>⭐ {movie.vote_average.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

// just tired man