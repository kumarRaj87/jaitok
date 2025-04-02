

import React from 'react';

const JoinView = ({ 
  channelName, 
  setChannelName, 
  isHost, 
  setIsHost, 
  handleJoin, 
  isLoading 
}) => (
  <div className="min-h-screen flex items-center justify-center p-4 bg-black">
    <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-gray-700 shadow-2xl shadow-pink-500/10 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500">
          Create Live Stream
        </h1>
      </div>

      <div className="space-y-6">
        <div className="animate-slide-up delay-100">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Channel Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-white placeholder-gray-500 transition-all duration-200 hover:border-pink-500/30"
              placeholder="Enter channel name"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="animate-slide-up delay-300">
          <button
            onClick={handleJoin}
            disabled={isLoading}
            className={`w-full py-3 px-6 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200 
              ${isLoading 
                ? 'bg-pink-500/50 cursor-not-allowed' 
                : 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white shadow-lg hover:shadow-pink-500/20'}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Connecting...
              </span>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 10l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 4v7a4 4 0 004 4h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Join Stream
              </div>
            )}
          </button>
        </div>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Create or join an existing live stream channel</p>
      </div>
    </div>
  </div>
);

export default JoinView;