import { Metadata } from "next";
import Image from "next/image";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import apiClient from "@/utils/apiClient";
import Navbar from "@/components/Navbar";

// Types
interface MovieDetails {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  genres: Array<{
    id: number;
    name: string;
  }>;
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
    }>;
  };
}

export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  try {
    const response = await apiClient.get(`/movie/${params.id}`);
    const movie = response.data;

    return {
      title: `${movie.title} - Movie Details`,
      description: movie.overview,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Movie Not Found",
      description: "Could not retrieve movie details.",
    };
  }
}

export default async function MovieDetailsPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  try {
    const response = await apiClient.get<MovieDetails>(`/movie/${params.id}`, {
      params: { append_to_response: "credits" },
    });

    const movie = response.data;

    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar disableSearchBar={true} />
        <div className="container mx-auto p-6">
          <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Poster */}
            <div className="w-full md:w-1/3 relative aspect-[2/3]">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                className="rounded-lg object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </div>

            {/* Movie Details */}
            <div className="w-full md:w-2/3 space-y-6">
              {/* Overview */}
              <div>
                <h2 className="text-2xl font-semibold mb-2">Overview</h2>
                <p className="text-gray-300 leading-relaxed">
                  {movie.overview}
                </p>
              </div>

              {/* Genres */}
              <div>
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
              </div>

              {/* Cast */}
              {movie.credits?.cast && (
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Top Cast</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {movie.credits.cast.slice(0, 6).map((actor, index) => (
                      <div
                        key={`${actor.id}-${index}`}
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Movie</h1>
          <p className="text-gray-400">
            Unable to fetch movie details. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}