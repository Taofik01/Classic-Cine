import { render, screen, fireEvent } from '@testing-library/react';
import MovieCard from '../MovieCard';
import { Movie } from '@/types/types';

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  poster_path: '/test.jpg',
  release_date: '2023-01-01',
  vote_average: 8.5,
  overview: 'This is a test overview',
  genres: [],
};

describe('MovieCard Component', () => {
  const mockToggleFavorite = jest.fn(); 

  it('renders the movie title and rating', () => {
    render(
      <MovieCard
        movie={mockMovie}
        isFavorite={false}
        onToggleFavorite={mockToggleFavorite}
      />
    );

    
    expect(screen.getByText(/test movie/i)).toBeInTheDocument();
    expect(screen.getByText(/8.5/)).toBeInTheDocument();
  });

  it('calls toggleFavorite when the favorite button is clicked', () => {
    render(
      <MovieCard
        movie={mockMovie}
        isFavorite={false}
        onToggleFavorite={mockToggleFavorite}
      />
    );

    
    const favoriteButton = screen.getByRole('button');
    fireEvent.click(favoriteButton);

    
    expect(mockToggleFavorite).toHaveBeenCalledWith(mockMovie);
  });
});
