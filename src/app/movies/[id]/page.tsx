import apiClient from '@/utils/apiClient';
import Navbar from '@/components/Navbar';


export async function generateMetadata({ params }: { params: { id: string } }) {
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

export default async function MovieDetailsPage({ params }: { params: { id: string } }) {
  try {
   
    const response = await apiClient.get(`/movie/${params.id}`, {
      params: { append_to_response: 'credits' },
    });

    const movie = response.data;

    return (
        <div>
            <Navbar disableSearchBar={true}  />
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
              <strong>Genres:</strong> {movie.genres.map((g: { id: number; name: string }) => g.name).join(", ")}
            </div>

            {/* Cast */}
            {movie.credits?.cast && (
              <div>
                <strong>Cast:</strong>
                <ul className="list-disc list-inside">
                  {movie.credits.cast.slice(0, 5).map((cast: { id: number; name: string; character: string }) => (
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
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return <div>Error loading movie details</div>;
  }
}
