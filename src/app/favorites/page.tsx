'use client';

import { useEffect, useState } from 'react';
import MovieCard from '@/components/MovieCard';
import { Movie } from '@/types/types';
import Navbar from '@/components/Navbar';
import { auth } from '@/app/firebase/config';
import { db } from '@/app/firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import {  collection, 
          doc, 
          getDocs, 
          query, 
          deleteDoc, 
          orderBy, 
          serverTimestamp,
          setDoc
        } from 'firebase/firestore';


const FAVORITE_STORAGE_KEY = 'favorites';


export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [ user ] = useAuthState(auth);

  // Load favorites from localStorage on initial (Fast UI)

  useEffect(() => {
    const loadLocalFavorites = () => {
      try {
        const storedFavorites = JSON.parse(localStorage.getItem(FAVORITE_STORAGE_KEY) || '[]');
        setFavorites(storedFavorites);
      } catch (error) {
        console.error('Error loading favorites from localStorage: ', error);
        setFavorites([]);
      } finally{
        setLoading(false);
      } 
    };
    loadLocalFavorites();
  }, []);

  // Load and sync with firebase when user is available
  useEffect(() => {
    if (user && loading) {
      syncWithFirebase();
    }
  }, [user, loading]);

  // Load user favorites from firebase and sync with localstorage
  const LoadUserfavorites = async (): Promise<Movie[]> => {
    if (!user) return Promise.resolve([]);

    try {
      const favoritesRef = collection(db, 'users', user.uid, 'favorites');
      const q = query(favoritesRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const movies: Movie[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Movie;
        movies.push({ ...data, id: typeof data.id === 'number' ? data.id : Number(doc.id) });
      });

      return movies;

    } catch (error) {
      console.error('Error loading favorites from Firebase:', error);
      return [];
    }
  };

  // save favories to firebase 

  const saveFavoritesToFirebase = async (favoritesToSave: Movie[]) => {
    if (!user) return;

    try {
      const favoritesRef = collection(db, 'users', user.uid, 'favorites');

      // create a batch operation for better performance
      const saveProimises = favoritesToSave.map(async (movie) => {
        const moviedoc = doc(favoritesRef, movie.id.toString());
        await setDoc(moviedoc, {
          ...movie,
          timestamp: serverTimestamp(),
        });

    });

    await Promise.all(saveProimises);
  } catch (error) {
    console.error('Error saving favorites to Firebase:', error);
  }
};

// Remove favorite from Firebase
const removeFavoriteFromFirebase = async (movieId: string | number) => {
  if (!user) return;

  try {
    const movieDoc = doc(db, 'users', user.uid, 'favorites', movieId.toString());
    await deleteDoc(movieDoc);

  } catch (error) {
    console.error('Error removing favorite from Firebase:', error);
  }
};

// sync localstorage with firebase
const syncWithFirebase = async () => {
  if (!user) return;
  setIsSyncing(true);

  try {
    // GET current favorites from localStorage
    const localFavorites = JSON.parse(localStorage.getItem(FAVORITE_STORAGE_KEY) || '[]') as Movie[];

    // GET FIREBASE FAVPORITES
    const firebaseFavorites = await LoadUserfavorites();

    // create a map for easier comparison
    const firebaseFavoritesMap = new Map(firebaseFavorites.map((movie: Movie) => [movie.id.toString(), movie]));

    // Find items to sync
    const localOnlyFavorites = localFavorites.filter((movie: Movie) => !firebaseFavoritesMap.has(movie.id.toString()));

    // Merge favorites (firebase takes precedence for conflict)
    const mergedFavories = [...firebaseFavorites];

    // Add local favorites that are not in firebase
    localOnlyFavorites.forEach((movie: Movie) => {
      if (!mergedFavories.some((fav) => fav.id === movie.id)) {
        mergedFavories.push(movie);
      }
    });

    // update localstorage with merged data
    localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(mergedFavories));
    setFavorites(mergedFavories);

    // save local only favorites to firebase 
    if (localOnlyFavorites.length > 0) {
      await saveFavoritesToFirebase(localOnlyFavorites);
    }
  } catch (error) {
    console.error('Error syncing favorites with firbase: ', error );
} finally {
  setIsSyncing(false);
}
};

// update localStorage helper
const updateLocalStorage = (newFavorites: Movie[]) => {

  try {
  localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(newFavorites));
  
  } catch (error) {
    console.error('Error updating localStorage: ', error);
  }
};

// Toggle favorite with Immediate UI update and background sync
const toggleFavorite = async (movie: Movie) => {
  const isFavorite = favorites.some((fav) => fav.id.toString() === movie.id.toString());

  const updatedFavorites = isFavorite
    ? favorites.filter((fav) => fav.id.toString() !== movie.id.toString()) // Remove favorite
    : [...favorites, movie]; // Add favorite

    // Update UI immediately
    setFavorites(updatedFavorites);
    updateLocalStorage(updatedFavorites);

    // sync with Firebase in the background
    if (user) {
      try {
        if (isFavorite) {
          await removeFavoriteFromFirebase(movie.id.toString());
        } else {
          await saveFavoritesToFirebase([movie]);
        }
      } catch (error) {
        console.error('Error toggling favorites in Firebase: ', error);
        // Optionally, you can revert the UI change if Firebase update fails
        // setFavorites(favorites);
        // updateLocalStorage(favorites);
    }

}
};

// force sync button (optional - for debugging or manual sync)

const handleForceSync = async () => {
  if (user && !isSyncing) {
    syncWithFirebase();
  }
};

  if (loading) {
    return (
      <div>
        <Navbar disableSearchBar={true} />
        <main className="container mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Loading Favorites...</h1>
          <p className="text-gray-500 text-center">Please wait while we load your favorite movies.</p>
        </main>
      </div>
    );
  }
  return (
    <div>
      <Navbar disableSearchBar={true} />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Your Favorite Movies</h1>
        {
          user && (
            <div className='flex items-center gap-2'>
              {
                isSyncing && (
                  <div className='text-sm text-gray-500 animate-pulse flex items-center gap-1'>
                    <span>Syncing with Firebase...</span>
                    <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2.93 6.93A8.003 8.003 0 014 12H0c0 5.523 4.477 10 10 10v-4a6.002 6.002 0 01-3.07-1.07z"></path>
                    </svg>
                  </div>
                )}
                {/* Optional: Add a manual sycing for debugging */}
                {            
                  <button   onClick={handleForceSync}
                  className="ml-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >SYNC</button>
                }
            </div>
          )}

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
          <div>
            <p className="text-gray-500 text-center">No favorite movies yet.</p>
            <p className='text-gray-500 text-center mt-2 text-sm'>
              {user ? "Start adding movies to your favorites!" : "Sign in to sync your favorites across devices."}
            </p>
          </div>
          
        )}
      </main>
    </div>
  );
}
