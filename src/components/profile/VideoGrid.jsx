import React from 'react';
import ProfileVideoCard from './ProfileVideoCard';

function VideoGrid({ videos, activeTab, sortBy, fetchUserVideos }) {
  const sortedVideos = [...videos].sort((a, b) => {
    if (sortBy === 'latest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'popular') return b.likes - a.likes;
    return 0;
  });

  if (sortedVideos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No videos found</h3>
        <p className="text-gray-500">Upload your first video to get started</p>
      </div>
    );
  }

  return (
    <div className="py-2 pr-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedVideos.map((video) => {
          return <ProfileVideoCard video={video} key={video.id} fetchUserVideos={fetchUserVideos} />
        })}
      </div>
    </div>
  );
}

export default VideoGrid;