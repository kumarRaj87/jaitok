import React from 'react';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Welcome to TikTok Clone</h1>
          <p className="text-xl mb-12">Share your moments with the world</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-4">Create</h2>
              <p className="mb-4">Upload and share your videos with our community</p>
              <img 
                src="https://placehold.co/400x300/pink/white?text=Create+Content"
                alt="Create Content"
                className="rounded-lg mx-auto"
              />
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-4">Connect</h2>
              <p className="mb-4">Engage with creators and build your following</p>
              <img 
                src="https://placehold.co/400x300/purple/white?text=Connect"
                alt="Connect"
                className="rounded-lg mx-auto"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing