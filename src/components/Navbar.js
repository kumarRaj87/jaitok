import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, PlusCircleIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

function Navbar({ setIsAuthenticated }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              TikTok Clone
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link 
              to="/feed" 
              className="flex flex-col items-center text-gray-700 hover:text-purple-600 transition-colors"
            >
              <HomeIcon className="h-6 w-6" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            
            <Link 
              to="/upload" 
              className="flex flex-col items-center text-gray-700 hover:text-purple-600 transition-colors"
            >
              <PlusCircleIcon className="h-6 w-6" />
              <span className="text-xs mt-1">Upload</span>
            </Link>
            
            <Link 
              to="/profile" 
              className="flex flex-col items-center text-gray-700 hover:text-purple-600 transition-colors"
            >
              <UserCircleIcon className="h-6 w-6" />
              <span className="text-xs mt-1">Profile</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex flex-col items-center text-gray-700 hover:text-purple-600 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6" />
              <span className="text-xs mt-1">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;