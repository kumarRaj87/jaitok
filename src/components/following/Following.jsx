

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { CheckCircle } from 'lucide-react';

// function Following() {
//   const [followingList, setFollowingList] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();
//   const token = localStorage.getItem('authToken');

//   const fetchFollowing = async () => {
//     try {
//       const response = await axios.get('https://jaitok-api.jaitia.com/query/follow', {
//         headers: {
//           'Content-Type': 'application/json',
//           'accept': 'application/json',
//           'access-token': token,
//         },
//       });
//       setFollowingList(response.data.data.records);
//     } catch (error) {
//       console.error('Error fetching following list:', error);
//     } finally {
//       setIsLoading(false); // Set loading to false after fetching
//     }
//   };

//   useEffect(() => {
//     fetchFollowing();
//   }, []);

//   const handleCardClick = (id) => {
//     navigate(`/user/${id}`);
//   };
  
//   const Shimmer = () => (
//     <div className="relative group overflow-hidden rounded-lg aspect-[3/4] w-[300px] h-[350px] bg-gray-200 animate-pulse">
//       <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 w-[300px] h-[350px]">
//         <div className="absolute bottom-0 left-0 right-0 p-4">
//           <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
//           <div className="h-4 bg-gray-300 rounded mb-3 w-1/2"></div>
//           <div className="h-10 bg-gray-300 rounded-md"></div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="flex h-screen bg-white lg:pl-72">
//       {/* Main Content */}
//       <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50">
//         <div className="max-w-8xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 md:gap-8 lg:gap-12">
//           {isLoading
//             ? Array.from({ length: 6 }).map((_, index) => <Shimmer key={index} />) // Show 6 shimmer cards while loading
//             : followingList.map((record, index) => (
//                 <div
//                   key={index}
//                   className="relative group overflow-hidden rounded-lg aspect-[3/4] w-[280px] lg:w-[300px] h-[250px] lg:h-[350px] cursor-pointer"
//                   onClick={() => handleCardClick(record.followingUser.id)}
//                 >
//                   <div className={`bg-gradient-to-br from-purple-500 to-pink-500 w-[280px] lg:w-[300px] h-[250px] lg:h-[350px] flex items-center justify-center`}>
//                     <span className="text-white font-bold lg:text-2xl lg:pb-0 pb-10 text-xl">
//                       {record.followingUser.firstName.charAt(0)}{record.followingUser.lastName.charAt(0)}
//                     </span>
//                   </div>
//                   <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 w-[280px] lg:w-[300px] h-[250px] lg:h-[350px] ">
//                     <div className="absolute bottom-0 left-0 right-0 p-4">
//                       <div className="flex items-center mb-2">
//                         <h3 className="text-white font-bold text-md lg:text-lg mr-2">
//                           {record.followingUser.firstName} {record.followingUser.lastName}
//                         </h3>
//                         <CheckCircle className="w-5 h-5 text-[#FE2C55]" />
//                       </div>
//                       <p className="text-white/80 text-xs lg:text-sm mb-3">{record.followingUser.email}</p>
//                       <button
//                         className="w-full text-sm bg-[#FE2C55] text-white py-2.5 rounded-md font-semibold hover:bg-[#e62a4f] transition-colors"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                         }}
//                       >
//                         Following
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Following;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

function Following() {
  const [followingList, setFollowingList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const fetchFollowing = async () => {
    try {
      const response = await axios.get('https://jaitok-api.jaitia.com/query/follow', {
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'access-token': token,
        },
      });
      setFollowingList(response.data.data.records);
    } catch (error) {
      console.error('Error fetching following list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowing();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/user/${id}`);
  };
  
  const Shimmer = () => (
    <div className="relative group overflow-hidden rounded-lg aspect-[3/4] w-full h-full bg-gray-200 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 w-full h-full">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded mb-3 w-1/2"></div>
          <div className="h-10 bg-gray-300 rounded-md"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-white lg:pl-72">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50 w-full">
        <div className="mx-auto grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="w-full h-[250px] sm:h-[300px] md:h-[320px] lg:h-[350px]">
                  <Shimmer />
                </div>
              ))
            : followingList.map((record, index) => (
                <div
                  key={index}
                  className="w-full h-[250px] sm:h-[300px] md:h-[320px] lg:h-[350px]"
                >
                  <div
                    className="relative group overflow-hidden rounded-lg w-full h-full cursor-pointer"
                    onClick={() => handleCardClick(record.followingUser.id)}
                  >
                    <div className={`bg-gradient-to-br from-purple-500 to-pink-500 w-full h-full flex items-center justify-center`}>
                      <span className="text-white font-bold text-2xl">
                        {record.followingUser.firstName.charAt(0)}{record.followingUser.lastName.charAt(0)}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 w-full h-full">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center mb-2">
                          <h3 className="text-white font-bold text-sm sm:text-base md:text-lg truncate">
                            {record.followingUser.firstName} {record.followingUser.lastName}
                          </h3>
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 text-[#FE2C55]" />
                        </div>
                        <p className="text-white/80 text-xs sm:text-sm truncate mb-3">{record.followingUser.email}</p>
                        <button
                          className="w-full text-xs sm:text-sm bg-[#FE2C55] text-white py-2 sm:py-2.5 rounded-md font-semibold hover:bg-[#e62a4f] transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          Following
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
        {!isLoading && followingList.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 w-full">
            <p className="text-gray-500 text-lg">You're not following anyone yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Following;