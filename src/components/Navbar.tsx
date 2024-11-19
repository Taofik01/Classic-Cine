import { Search } from 'lucide-react';

interface NavbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ searchTerm, setSearchTerm }) => (
  <nav className="bg-gray-800 p-4 flex justify-between items-center">
    <h1 className="text-2xl font-bold">🎬 Movie Library</h1>
    <div className="relative">
      <input
        type="text"
        placeholder="Search movies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-gray-700 text-white px-4 py-2 rounded-full pl-10"
      />
      <Search className="absolute left-3 top-3 text-gray-400" size={20} />
    </div>
  </nav>
);

export default Navbar;
