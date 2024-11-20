import apiClient from '@/utils/apiClient';
import Navbar from '@/components/Navbar';
import { Genre, Cast, Movie } from '@/types/types';



interface MovieDetailsProps {
    params: { id: string };
  }



export default async function MovieDetailsPage({ params }: MovieDetailsProps) {
  const { id } = params;
 




  const response = await apiClient.get<Movie & { credits: { cast: Cast[] } }>(`/movie/${id}`, {
    params: { append_to_response: 'credits' },
  });

  const movie = response.data;

  return (
    <div>
     
      <Navbar disableSearchBar={true}   />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Poster */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full max-w-md rounded-lg"
          />
          <div>
            {/* Overview */}
            <p className="mb-4">{movie.overview}</p>

            {/* Genres */}
            <div className="mb-4">
              <strong>Genres:</strong>{' '}
              {movie.genres.map((genre: Genre) => genre.name).join(', ')}
            </div>

            {/* Cast (optional) */}
            {movie.credits?.cast && (
              <div>
                <strong>Cast:</strong>
                <ul className="list-disc list-inside">
                  {movie.credits.cast.slice(0, 5).map((cast: Cast) => (
                    <li key={cast.id}>
                      {cast.name} as {cast.character}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
