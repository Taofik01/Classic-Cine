'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { auth } from '@/app/firebase/config';
import { signOut } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';


interface NavbarProps {
  searchTerm?: string; // Optional
  setSearchTerm?: (term: string) => void; // Optional
  disableSearchBar?: boolean; // Optional
}

const Navbar: React.FC<NavbarProps> = ({
  searchTerm = '',
  setSearchTerm = () => {}, // Default no-op
  disableSearchBar = false,
}) => {

  const [user] = useAuthState(auth);
  const router = useRouter();
  // console.log('USER', user);

  const notify = () => toast("You've been Logged out successfully!",{
    autoClose: 3000,
  });

  return (
    <>
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-2xl font-bold text-white">
          🎬 Classic Cine
        </Link>
        <Link href="/favorites" className="text-sm text-gray-300 hover:text-white transition">
          Favorites
        </Link>
      </div>
      <div className="relative">
        <input
          type="text"
          placeholder="Search movies..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={disableSearchBar}
          className={`bg-gray-700 text-white px-4 py-2 rounded-full pl-10 ${
            disableSearchBar ? 'cursor-not-allowed opacity-50' : ''
          }`}
        />
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />

        {/* Replace the following with your user state logic */}
        {user ? (
          <button
            onClick={async () => {
              signOut(auth);
              sessionStorage.removeItem('user');
              sessionStorage.clear();
              // clear favorites from localStorage
              localStorage.removeItem('favorites');
              notify();
               await new Promise(resolve => setTimeout(resolve, 1000));

              router.push('/signin'); // Redirect to sign-in page after logout
            }}
            className="ml-4 text-sm text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
          >
            Log out
          </button>
        ) : (
          <Link href="/signup" className="ml-4 text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition">
            SIGN UP
          </Link>
        )}
        
        
      </div>
      
    </nav>
    <ToastContainer />
    </>
  );
};

export default Navbar;
