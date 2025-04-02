import React, { useState, useEffect } from 'react';
import EditProfileModal from './EditProfileModal';
import VideoGrid from './VideoGrid';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ExternalLink, MapPin, Check, Edit3 } from 'lucide-react';

function Profile() {
  const [profile, setProfile] = useState({
    username: '',
    followers: 0,
    following: 0,
    likes: 0,
    bio: '',
    email: '',
    firstName: '',
    lastName: '',
    website: '',
    avatar: '',
    location: '',
    countryCode: '',
    isVerified: false,
    role: '',
    isActive: true,
  });

  const [videos, setVideos] = useState([]);
  const [activeTab, setActiveTab] = useState("videos");
  const [activeSort, setActiveSort] = useState("latest");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(true);

  const authToken = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://jaitok-api.jaitia.com/query/users/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            "access-token": authToken,
          },
        }
      );

      if (response.data.success) {
        const userData = response.data.data;
        setProfile({
          username: userData.username || '',
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          bio: userData.bio || '',
          website: userData.website || '',
          avatar: userData.avatar || '',
          location: userData.location || '',
          countryCode: userData.countryCode || '',
          isVerified: userData.isVerified || false,
          role: userData.role || '',
          isActive: userData.isActive || true,
          followers: userData.followerCount || 0,
          following: userData.followingCount || 0,
          likes: userData.likeCount || 0,
        });
      }
    } catch (error) {
      toast.error("Error fetching profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserVideos = async () => {
    setVideosLoading(true);
    try {
      const response = await axios.get(
        'https://jaitok-api.jaitia.com/query/videos/user',
        {
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            "access-token": authToken,
          },
        }
      );

      if (response.data.success) {
        setVideos(response.data.data || []);
      }
    } catch (error) {
      toast.error("Error fetching videos");
    } finally {
      setVideosLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchUserVideos();
  }, []);

  useEffect(() => {
    fetchUserVideos();
  }, [activeTab]);

  const tabs = [
    { id: 'videos', label: 'Videos', count: videos.length },
    { id: 'favorites', label: 'Favorites', count: 0 },
    { id: 'liked', label: 'Liked', count: 0 }
  ];

  const sortOptions = [
    { id: 'latest', label: 'Latest' },
    { id: 'popular', label: 'Popular' },
    { id: 'oldest', label: 'Oldest' }
  ];

  const ProfileSkeleton = () => (
    <div className="animate-pulse">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200"></div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="h-7 w-36 bg-gray-200 rounded-md"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
          </div>
          <div className="flex flex-wrap gap-6 mb-4">
            <div className="h-6 w-24 bg-gray-200 rounded-md"></div>
            <div className="h-6 w-24 bg-gray-200 rounded-md"></div>
            <div className="h-6 w-24 bg-gray-200 rounded-md"></div>
          </div>
          <div className="h-4 w-3/4 bg-gray-200 rounded-md mb-2"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );

  // Create initials for avatar
  const getInitials = () => {
    if (profile.firstName && profile.lastName) {
      return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
    }
    return profile.username.charAt(0).toUpperCase();
  };

  // Format numbers for display (e.g., 1200 becomes 1.2K)
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  return (
    <div className="min-h-[50vh] w-full overflow-y-auto lg:pl-72 pl-0 overflow-x-hidden">
      <div className="p-4 sm:p-6 md:p-8 border-b border-gray-200">
        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden ring-4 ring-gray-50 shadow-md">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.username}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold">
                  {getInitials()}
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h1 className="text-xl md:text-2xl font-bold">{profile.username}</h1>
                {profile.isVerified && (
                  <span className="inline-flex items-center justify-center bg-blue-100 text-blue-600 h-6 w-6 rounded-full">
                    <Check size={16} />
                  </span>
                )}
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition shadow-sm"
                >
                  <Edit3 size={16} />
                  <span className="hidden sm:inline">Edit profile</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-6 mb-4">
                <div className="flex items-center">
                  <span className="font-bold mr-1">{formatNumber(profile.following)}</span>
                  <span className="text-gray-600">Following</span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold mr-1">{formatNumber(profile.followers)}</span>
                  <span className="text-gray-600">Followers</span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold mr-1">{formatNumber(profile.likes)}</span>
                  <span className="text-gray-600">Likes</span>
                </div>
              </div>

              <p className="text-gray-700 max-w-lg">{profile.bio || "No bio yet"}</p>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-3">
                {profile.website && (
                  <a
                    href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:underline gap-1"
                  >
                    <ExternalLink size={16} />
                    {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                {profile.location && (
                  <p className="flex items-center text-gray-600 gap-1">
                    <MapPin size={16} />
                    {profile.location}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-b border-gray-200 sticky top-0 bg-white z-10 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 sm:px-6 md:px-8">
          <div className="overflow-x-auto pb-1 md:pb-0">
            <div className="flex gap-6 md:gap-8 min-w-max">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 relative flex items-center ${activeTab === tab.id
                      ? 'text-black font-medium'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100">
                      {formatNumber(tab.count)}
                    </span>
                  )}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2 pb-3 sm:py-0">
            {sortOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setActiveSort(option.id)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${activeSort === option.id
                    ? 'bg-rose-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content area with shimmer loading */}
      <div className="px-4 sm:px-6 md:px-8 py-5">
        {videosLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[9/16] bg-gray-200 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <VideoGrid
            videos={videos}
            activeTab={activeTab}
            sortBy={activeSort}
            fetchUserVideos={fetchUserVideos}
          />
        )}
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        fetchProfile={fetchProfile}
      />
    </div>
  );
}

export default Profile;