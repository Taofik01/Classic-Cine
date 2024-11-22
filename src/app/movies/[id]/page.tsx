import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import apiClient from "@/utils/apiClient";
import Navbar from "@/components/Navbar";

// Type Definitions remain the same
interface Genre {
  id: number;
  name: string;
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path?: string;
}

interface MovieDetails {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date?: string;
  vote_average?: number;
  genres: Genre[];
  credits?: {
    cast: Cast[];
  };
}

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// Modified API Function
async function fetchMovieDetails(id: string): Promise<MovieDetails> {
  if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
    throw new Error('API key is not configured');
  }

  const { data } = await apiClient.get<MovieDetails>(`/movie/${id}`, {
    params: {
      api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
      append_to_response: "credits",
    },
  });

  if (!data) {
    throw new Error('No data received');
  }

  return data;
}

// Modified Metadata Generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const movie = await fetchMovieDetails(params.id);
    
    return {
      title: `${movie.title} - Movie Details`,
      description: movie.overview || "Movie details and information.",
      openGraph: {
        title: movie.title,
        description: movie.overview,
        images: movie.poster_path 
          ? [`https://image.tmdb.org/t/p/w500${movie.poster_path}`]
          : undefined,
      },
    };
  } catch {
    return {
      title: "Movie Not Found",
      description: "Unable to retrieve movie details.",
    };
  }
}

// Modified Page Component
export default async function MovieDetailsPage({ params }: Props) {
  let movie: MovieDetails;
  
  try {
    movie = await fetchMovieDetails(params.id);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar disableSearchBar={true} />
      <main className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Poster Section */}
          <div className="w-full md:w-1/3 relative aspect-[2/3]">
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`${movie.title} poster`}
                fill
                className="rounded-lg object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No poster available</span>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="w-full md:w-2/3 space-y-6">
            {/* Overview */}
            <section>
              <h2 className="text-2xl font-semibold mb-2">Overview</h2>
              <p className="text-gray-300 leading-relaxed">
                {movie.overview || "No overview available."}
              </p>
            </section>

            {/* Additional Info */}
            <section>
              <div className="flex flex-wrap gap-4">
                {movie.release_date && (
                  <div>
                    <h3 className="text-sm text-gray-400">Release Date</h3>
                    <p>{new Date(movie.release_date).toLocaleDateString()}</p>
                  </div>
                )}
                {movie.vote_average !== undefined && (
                  <div>
                    <h3 className="text-sm text-gray-400">Rating</h3>
                    <p>{movie.vote_average.toFixed(1)}/10</p>
                  </div>
                )}
              </div>
            </section>

            {/* Genres */}
            <section>
              <h2 className="text-2xl font-semibold mb-2">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </section>

            {/* Cast */}
            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-2">Top Cast</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {movie.credits.cast.slice(0, 6).map((actor) => (
                    <div
                      key={actor.id}
                      className="bg-gray-800 p-4 rounded-lg flex items-center gap-4"
                    >
                      <div>
                        <p className="font-semibold">{actor.name}</p>
                        <p className="text-sm text-gray-400">
                          as {actor.character}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true;