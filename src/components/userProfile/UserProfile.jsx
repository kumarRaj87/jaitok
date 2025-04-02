// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import VideoGrid from "../profile/VideoGrid";

// const ShimmerLoader = () => (
//     <div className="min-h-screen overflow-y-auto pl-72 w-full">
//         <div className="p-6 border-b border-gray-200">
//             <div className="flex items-center gap-6">
//                 {/* Avatar shimmer */}
//                 <div className="w-20 h-20 rounded-full overflow-hidden relative bg-gray-200">
//                     <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
//                 </div>

//                 <div className="flex-1">
//                     {/* Username shimmer */}
//                     <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>

//                     {/* Stats shimmer */}
//                     <div className="flex gap-6 mb-4">
//                         {[1, 2, 3].map((i) => (
//                             <div key={i} className="h-5 w-20 bg-gray-200 rounded"></div>
//                         ))}
//                     </div>

//                     {/* Bio shimmer */}
//                     <div className="h-12 w-full bg-gray-200 rounded"></div>
//                 </div>
//             </div>
//         </div>

//         {/* Tabs shimmer */}
//         <div className="border-b border-gray-200">
//             <div className="flex justify-between items-center px-6 py-3">
//                 <div className="flex gap-6">
//                     {[1, 2, 3].map((i) => (
//                         <div key={i} className="h-5 w-16 bg-gray-200 rounded"></div>
//                     ))}
//                 </div>
//             </div>
//         </div>

//         {/* Content area shimmer */}
//         <div className="p-6 grid grid-cols-3 gap-4">
//             {[1, 2, 3, 4, 5, 6].map((i) => (
//                 <div key={i} className="aspect-w-9 aspect-h-16 bg-gray-200 rounded-lg"></div>
//             ))}
//         </div>
//     </div>
// );

// const UserProfile = () => {
//     const { id } = useParams();
//     const [user, setUser] = useState({
//         username: '',
//         followers: 0,
//         following: 0,
//         likes: 0,
//         bio: '',
//         email: "",
//         firstName: "",
//         lastName: "",
//         website: "",
//         avatar: "",
//     });
//     const [loading, setLoading] = useState(true);
//     const [videos, setVideos] = useState([]);
//     const [error, setError] = useState(null);
//     const [activeTab, setActiveTab] = useState("videos");
//     const [activeSort, setActiveSort] = useState("latest");
//     const [isFollowing, setIsFollowing] = useState(false);

//     const tabs = [
//         { id: 'videos', label: 'Videos', icon: 'video-camera' },
//         { id: 'favorites', label: 'Favorites', icon: 'star' },
//         { id: 'liked', label: 'Liked', icon: 'heart' }
//     ];

//     const sortOptions = [
//         { id: 'latest', label: 'Latest' },
//         { id: 'popular', label: 'Popular' },
//         { id: 'oldest', label: 'Oldest' }
//     ];

//     const authToken = localStorage.getItem('authToken');

//     const fetchProfile = async () => {
//         try {
//             if (!authToken) return;
//             const response = await axios.get(`https://jaitok-api.jaitia.com/query/users/${id}`, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'accept': 'application/json',
//                     'access-token': authToken,
//                 },
//             });
//             const userData = response.data.data;
//             setUser({
//                 username: userData.username || "No Username",
//                 followers: userData.followers || 0,
//                 following: userData.following || 0,
//                 likes: userData.likes || 0,
//                 bio: userData.bio || "No bio yet.",
//                 email: userData.email || "no email",
//                 firstName: userData.firstName || "",
//                 lastName: userData.lastName || "",
//                 website: userData.website || "",
//                 avatar: userData.avatar || "",
//             });
//             setLoading(false);
//         } catch (err) {
//             setError("Failed to fetch user details");
//             setLoading(false);
//         }
//     };

//     const fetchUserVideos = async () => {
//         try {
//             const response = await axios.get(`https://jaitok-api.jaitia.com/query/videos/user/${id}`, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     accept: "application/json",
//                     "access-token": authToken,
//                 },
//             });

//             if (response.data.success) {
//                 setVideos(response.data.data || []);
//             }
//         } catch (error) {
//             toast.error("Error fetching videos.");
//         }
//     };

//     const handleFollow = () => {
//         setIsFollowing(!isFollowing);
//         toast.success(isFollowing ? "Unfollowed user" : "Following user");
//     };

//     useEffect(() => {
//         fetchProfile();
//         fetchUserVideos();
//     }, []);

//     useEffect(() => {
//         fetchProfile();
//         fetchUserVideos();
//     }, [id]);

//     if (loading) return <ShimmerLoader />;
//     if (error) return (
//         <div className="min-h-screen flex items-center justify-center">
//             <div className="p-6 bg-white rounded-lg shadow-md text-center">
//                 <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                 </svg>
//                 <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Profile</h3>
//                 <p className="text-gray-600">{error}</p>
//                 <button
//                     onClick={() => window.location.reload()}
//                     className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
//                 >
//                     Try Again
//                 </button>
//             </div>
//         </div>
//     );

//     return (
//         <div className="min-h-screen overflow-y-auto pl-72 w-full">
//             {/* Profile Header */}
//             <div className="border-b border-gray-200">
//                 <div className="py-4 px-6">
//                     <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
//                         <div className="w-20 h-20 rounded-full overflow-hidden shadow-sm border border-gray-200">
//                             {/* {user.avatar ? (
//                                 <img
//                                     src={`https://jaitok-api.jaitia.com/${user.avatar}`}
//                                     alt="Profile Avatar"
//                                     className="w-full h-full object-cover"
//                                 />
//                             ) : (
//                                 <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-3xl font-bold">
//                                     {user.username.charAt(0).toUpperCase()}
//                                 </div>
//                             )} */}

//                             <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-3xl font-bold">
//                                 {user.username.charAt(0).toUpperCase()}
//                             </div>
//                         </div>

//                         <div className="flex-1 md:ml-2 text-center md:text-left items-start flex flex-col justify-center gap-3">
//                             <div className="flex flex-col md:flex-row md:items-center gap-3 w-full">
//                                 <h1 className="text-lg font-semibold text-gray-800">
//                                     {user.username}
//                                 </h1>
//                                 <div className="flex gap-2 mt-2 md:mt-0">
//                                     <button
//                                         onClick={handleFollow}
//                                         className={`px-6 py-1.5 rounded-md text-sm font-medium shadow-sm ${isFollowing
//                                                 ? 'bg-gray-100 text-gray-800 border border-gray-300'
//                                                 : 'bg-red-500 text-white'
//                                             }`}
//                                     >
//                                         {isFollowing ? 'Following' : 'Follow'}
//                                     </button>
//                                     <button className="p-1.5 bg-gray-100 rounded-md text-gray-600 hover:bg-gray-200 transition-colors">
//                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
//                                         </svg>
//                                     </button>
//                                 </div>
//                             </div>

//                             <div className="flex flex-wrap justify-center md:justify-start gap-6">
//                                 {[
//                                     { label: 'Following', value: user.following },
//                                     { label: 'Followers', value: user.followers },
//                                     { label: 'Likes', value: user.likes }
//                                 ].map((stat) => (
//                                     <div key={stat.label} className="text-center">
//                                         <span className="block text-base font-semibold text-gray-800">{stat.value.toLocaleString()}</span>
//                                         <span className="text-sm text-gray-500">{stat.label}</span>
//                                     </div>
//                                 ))}
//                             </div>

//                             <p className="text-sm text-gray-600 max-w-2xl">
//                                 {user.bio ? user.bio : "No bio yet"}
//                             </p>

//                             {user.website && (
//                                 <a
//                                     href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="text-sm inline-flex items-center text-blue-500 hover:text-blue-600"
//                                 >
//                                     <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
//                                     </svg>
//                                     {user.website ? user.website : "No website yet"}
//                                 </a>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Tabs Navigation */}
//             <div className="border-b border-gray-200 sticky top-0 z-10 bg-white shadow-sm pt-2">
//                 <div className="px-6">
//                     <div className="flex justify-between items-center">
//                         <div className="flex">
//                             {tabs.map((tab) => (
//                                 <button
//                                     key={tab.id}
//                                     onClick={() => setActiveTab(tab.id)}
//                                     className={`py-3 px-4 flex items-center gap-2 relative transition-colors ${activeTab === tab.id
//                                             ? 'text-red-500 font-medium'
//                                             : 'text-gray-600 hover:text-gray-800'
//                                         }`}
//                                 >
//                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         {tab.icon === 'video-camera' && (
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                                         )}
//                                         {tab.icon === 'star' && (
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
//                                         )}
//                                         {tab.icon === 'heart' && (
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                                         )}
//                                     </svg>
//                                     <span className="text-sm">{tab.label}</span>
//                                     {activeTab === tab.id && (
//                                         <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>
//                                     )}
//                                 </button>
//                             ))}
//                         </div>
//                         <div className="flex gap-2">
//                             {sortOptions.map((option) => (
//                                 <button
//                                     key={option.id}
//                                     onClick={() => setActiveSort(option.id)}
//                                     className={`px-3 py-1.5 rounded-md text-xs transition-colors ${activeSort === option.id
//                                             ? 'bg-red-500 text-white shadow-sm'
//                                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                                         }`}
//                                 >
//                                     {option.label}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Content Area */}
//             <div className="p-2">
//                 {videos.length > 0 && (
//                     <VideoGrid
//                         videos={videos}
//                         activeTab={activeTab}
//                         sortBy={activeSort}
//                         fetchUserVideos={fetchUserVideos}
//                     />
//                 )}

//                 {videos.length === 0 && (
//                     <div className="text-center py-12">
//                         <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                         </svg>
//                         <h3 className="text-base font-semibold text-gray-700 mb-1">No {activeTab} found</h3>
//                         <p className="text-sm text-gray-500">This user hasn't added any {activeTab} yet.</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default UserProfile;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import VideoGrid from "../profile/VideoGrid";

// Shimmer Loader Component
const ShimmerLoader = () => (
  <div className="min-h-screen overflow-y-auto pl-0 md:pl-72 w-full">
    {/* Profile Header Shimmer */}
    <div className="p-6 border-b border-gray-200">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar Shimmer */}
        <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="flex-1 space-y-4">
          {/* Username Shimmer */}
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
          {/* Stats Shimmer */}
          <div className="flex gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
          {/* Bio Shimmer */}
          <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>

    {/* Tabs Shimmer */}
    <div className="border-b border-gray-200">
      <div className="px-6 py-3 flex justify-between items-center">
        <div className="flex gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>

    {/* Video Grid Shimmer */}
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="aspect-w-9 aspect-h-16 bg-gray-200 rounded-lg animate-pulse"></div>
      ))}
    </div>
  </div>
);

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState({
    username: "",
    followers: 0,
    following: 0,
    likes: 0,
    bio: "",
    email: "",
    firstName: "",
    lastName: "",
    website: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("videos");
  const [activeSort, setActiveSort] = useState("latest");
  const [isFollowing, setIsFollowing] = useState(false);

  const tabs = [
    { id: "videos", label: "Videos", icon: "video-camera" },
    { id: "favorites", label: "Favorites", icon: "star" },
    { id: "liked", label: "Liked", icon: "heart" },
  ];

  const sortOptions = [
    { id: "latest", label: "Latest" },
    { id: "popular", label: "Popular" },
    { id: "oldest", label: "Oldest" },
  ];

  const authToken = localStorage.getItem("authToken");

  const fetchProfile = async () => {
    try {
      if (!authToken) return;
      const response = await axios.get(`https://jaitok-api.jaitia.com/query/users/${id}`, {
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          "access-token": authToken,
        },
      });
      const userData = response.data.data;
      setUser({
        username: userData.username || "No Username",
        followers: userData.followers || 0,
        following: userData.following || 0,
        likes: userData.likes || 0,
        bio: userData.bio || "No bio yet.",
        email: userData.email || "no email",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        website: userData.website || "",
        avatar: userData.avatar || "",
      });
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch user details");
      setLoading(false);
    }
  };

  const fetchUserVideos = async () => {
    try {
      const response = await axios.get(`https://jaitok-api.jaitia.com/query/videos/user/${id}`, {
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          "access-token": authToken,
        },
      });

      if (response.data.success) {
        setVideos(response.data.data || []);
      }
    } catch (error) {
      toast.error("Error fetching videos.");
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? "Unfollowed user" : "Following user");
  };

  useEffect(() => {
    fetchProfile();
    fetchUserVideos();
  }, [id]);

  if (loading) return <ShimmerLoader />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Profile</h3>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen overflow-y-auto pl-0 md:pl-72 w-full">
      {/* Profile Header */}
      <div className="border-b border-gray-200">
        <div className="py-4 px-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full overflow-hidden shadow-sm border border-gray-200">
              <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-3xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 md:ml-2 text-center md:text-left items-start flex flex-col justify-center gap-3">
              <div className="flex flex-col md:flex-row md:items-center gap-3 w-full">
                <h1 className="text-lg font-semibold text-gray-800">{user.username}</h1>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button
                    onClick={handleFollow}
                    className={`px-6 py-1.5 rounded-md text-sm font-medium shadow-sm ${
                      isFollowing ? "bg-gray-100 text-gray-800 border border-gray-300" : "bg-red-500 text-white"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                  <button className="p-1.5 bg-gray-100 rounded-md text-gray-600 hover:bg-gray-200 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                {[
                  { label: "Following", value: user.following },
                  { label: "Followers", value: user.followers },
                  { label: "Likes", value: user.likes },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <span className="block text-base font-semibold text-gray-800">{stat.value.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Bio */}
              <p className="text-sm text-gray-600 max-w-2xl">{user.bio ? user.bio : "No bio yet"}</p>

              {/* Website */}
              {user.website && (
                <a
                  href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm inline-flex items-center text-blue-500 hover:text-blue-600"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {user.website ? user.website : "No website yet"}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 sticky top-0 z-10 bg-white shadow-sm pt-2">
        <div className="px-6">
          <div className="flex justify-between items-center">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-4 flex items-center gap-2 relative transition-colors ${
                    activeTab === tab.id ? "text-red-500 font-medium" : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {tab.icon === "video-camera" && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    )}
                    {tab.icon === "star" && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    )}
                    {tab.icon === "heart" && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    )}
                  </svg>
                  <span className="text-sm">{tab.label}</span>
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setActiveSort(option.id)}
                  className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                    activeSort === option.id ? "bg-red-500 text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-2">
        {videos.length > 0 ? (
          <VideoGrid videos={videos} activeTab={activeTab} sortBy={activeSort} fetchUserVideos={fetchUserVideos} />
        ) : (
          <div className="text-center py-12">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h3 className="text-base font-semibold text-gray-700 mb-1">No {activeTab} found</h3>
            <p className="text-sm text-gray-500">This user hasn't added any {activeTab} yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;