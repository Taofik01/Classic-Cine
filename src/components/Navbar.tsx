'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';

interface NavbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  disableSearchBar?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ searchTerm, setSearchTerm, disableSearchBar = false }) => (
  <nav className="bg-gray-800 p-4 flex justify-between items-center">
    <div className="flex items-center gap-4">
      <Link href="/" className="text-2xl font-bold text-white">
        🎬 Movie Library
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
    </div>
  </nav>
);

export default Navbar;
