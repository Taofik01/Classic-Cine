import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '../page';
import { Movie } from '@/types/types';
import * as apiClient from '@/utils/apiClient';

jest.mock('@/utils/apiClient'); 

const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Mock Movie 1',
    poster_path: '/mock1.jpg',
    release_date: '2023-01-01',
    vote_average: 7.5,
    overview: 'Overview for mock movie 1',
    genres: [],
  },
  {
    id: 2,
    title: 'Mock Movie 2',
    poster_path: '/mock2.jpg',
    release_date: '2023-01-02',
    vote_average: 8.1,
    overview: 'Overview for mock movie 2',
    genres: [],
  },
];

describe('HomePage Component', () => {
  it('renders popular movies on load', async () => {
    (apiClient.default.get as jest.Mock).mockResolvedValueOnce({
      data: { results: mockMovies },
    });

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText(/mock movie 1/i)).toBeInTheDocument();
      expect(screen.getByText(/mock movie 2/i)).toBeInTheDocument();
    });
  });

  it('shows a loader while fetching movies', async () => {
    
    (apiClient.default.get as jest.Mock).mockResolvedValueOnce({
      data: { results: [] },
    });

    render(<HomePage />);

   
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
