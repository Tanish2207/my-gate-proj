import { Link } from 'react-router-dom';
import { HomeIcon, ShieldCheckIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  return (
    <nav className="glass-effect border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-primary">ResManage</Link>
            <div className="flex space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-text hover:text-primary transition-colors">
                <HomeIcon className="h-5 w-5" />
                <span>Flat Owner</span>
              </Link>
              <Link to="/security" className="flex items-center space-x-2 text-text hover:text-primary transition-colors">
                <ShieldCheckIcon className="h-5 w-5" />
                <span>Security</span>
              </Link>
              <Link to="/add-flat" className="flex items-center space-x-2 text-text hover:text-primary transition-colors">
                <PlusIcon className="h-5 w-5" />
                <span>Add Flat</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}