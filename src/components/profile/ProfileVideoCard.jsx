// import { Bookmark, MessageCircle, Share2, MoreHorizontal, Edit, Trash2, X } from 'lucide-react';
// import React, { useRef, useEffect, useState } from 'react';
// import { FaHeart } from 'react-icons/fa6';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import CommentModal from './VideoCommentModal';

// const ProfileVideoCard = ({ video, onVideoUpdate, fetchUserVideos }) => {
//   const videoRef = useRef(null);
//   const [showMenu, setShowMenu] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showCommentModal, setShowCommentModal] = useState(false);
//   const [isLiked, setIsLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState(video?.totalLikes || 0);
//   const [editForm, setEditForm] = useState({
//     title: video?.title || '',
//     description: video?.description || '',
//     visibility: video?.visibility || 'public',
//     allowDuet: video?.allowDuet !== undefined ? video?.allowDuet : true,
//     allowStitch: video?.allowStitch !== undefined ? video?.allowStitch : true,
//     allowComments: video?.allowComments !== undefined ? video?.allowComments : true,
//     isActive: video?.isActive !== undefined ? video?.isActive : true
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

//   const userId = localStorage.getItem("userId");
//   const authToken = localStorage.getItem("authToken");

//   const videoSrc = video.videoUrl;

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (videoRef.current) {
//             if (entry.isIntersecting) {
//               videoRef.current.play();
//             } else {
//               videoRef.current.pause();
//             }
//           }
//         });
//       },
//       { threshold: 0.6 }
//     );

//     if (videoRef.current) {
//       observer.observe(videoRef.current);
//     }

//     return () => {
//       if (videoRef.current) {
//         observer.unobserve(videoRef.current);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (showMenu && !event.target.closest('.options-menu')) {
//         setShowMenu(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showMenu]);

//   const handleLikeToggle = async () => {
//     try {
//       if (isLiked) {
//         // Unlike the video
//         const response = await axios.delete(
//           `https://jaitok-api.jaitia.com/interactions/interactions/videos/${video.id}/unlike`,
//           {
//             headers: {
//               'Accept': 'application/json',
//               'access-token': authToken
//             }
//           }
//         );

//         if (response.data.success) {
//           setIsLiked(false);
//           setLikeCount(prev => Math.max(0, prev - 1));
//           toast.success("Video unliked successfully!");
//         }
//       } else {
//         // Like the video
//         const response = await axios.post(
//           `https://jaitok-api.jaitia.com/interactions/interactions/videos/${video.id}/like`,
//           {},
//           {
//             headers: {
//               'Accept': 'application/json',
//               'access-token': authToken
//             }
//           }
//         );

//         if (response.data.success) {
//           setIsLiked(true);
//           setLikeCount(prev => prev + 1);
//           toast.success("Video liked successfully!");
//         }
//       }
//     } catch (err) {
//       console.error('Error toggling like:', err);
//       toast.error(err.response?.data?.message || 'Failed to update like status. Please try again.');
//     }
//   };

//   const handleEdit = () => {
//     setEditForm({
//       title: video?.title || '',
//       description: video?.description || '',
//       visibility: video?.visibility || 'public',
//       allowDuet: video?.allowDuet !== undefined ? video?.allowDuet : true,
//       allowStitch: video?.allowStitch !== undefined ? video?.allowStitch : true,
//       allowComments: video?.allowComments !== undefined ? video?.allowComments : true,
//       isActive: video?.isActive !== undefined ? video?.isActive : true
//     });
//     setShowEditModal(true);
//     setShowMenu(false);
//   };

//   const handleDelete = () => {
//     setShowDeleteConfirm(true);
//     setShowMenu(false);
//   };

//   const confirmDelete = async () => {
//     setIsDeleting(true);

//     try {
//       const response = await axios.delete(
//         `https://jaitok-api.jaitia.com/interactions/videos/${video.id}`,
//         {
//           headers: {
//             'Accept': 'application/json',
//             'access-token': authToken
//           }
//         }
//       );

//       if (response.data.success) {
//         toast.success("Video deleted successfully!");
//         if (typeof fetchUserVideos === 'function') {
//           fetchUserVideos();
//         }
//         setShowDeleteConfirm(false);
//       } else {
//         throw new Error(response.data.message || 'Failed to delete video');
//       }
//     } catch (err) {
//       console.error('Error deleting video:', err);
//       toast.error(err.response?.data?.message || 'Failed to delete video. Please try again.');
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setEditForm(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError(null);

//     try {
//       const response = await axios.patch(
//         `${import.meta.env.VITE_API_URL}/videos/${video.id}`,
//         editForm,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${authToken}`
//           }
//         }
//       );

//       if (response.status === 200) {
//         if (typeof onVideoUpdate === 'function') {
//           onVideoUpdate(video.id, response.data);
//         }
//         fetchUserVideos();
//         setShowEditModal(false);
//         toast.success("Updated successfully!");
//       }
//     } catch (err) {
//       console.error('Error updating video:', err);
//       setError(err.response?.data?.message || 'Failed to update video. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="relative rounded-xl shadow-lg overflow-hidden group bg-white border border-gray-200">
//       <video
//         ref={videoRef}
//         src={videoSrc}
//         className="w-full h-[450px] object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
//         loop
//         muted
//         playsInline
//         crossOrigin="anonymous"
//         preload="auto"
//         onError={(e) => console.error("Video failed to load", e)}
//       />

//       <div className="absolute inset-0 bg-gradient-to-t from-black to-gray-900 opacity-50 group-hover:opacity-70 transition-all"></div>

//       <div className="absolute bottom-5 left-4 text-white pr-16">
//         <h3 className="font-bold text-lg truncate">{video.title}</h3>
//         <p className="text-sm text-gray-100 line-clamp-2">{video.description}</p>
//       </div>

//       {userId === video.user?.id &&
//         <div className="absolute top-4 right-4 options-menu">
//           <button
//             onClick={() => setShowMenu(!showMenu)}
//             className="flex items-center justify-center p-2 bg-white bg-opacity-30 rounded-full hover:bg-opacity-100 transition shadow-md"
//           >
//             <MoreHorizontal className="text-gray-100 hover:text-gray-900" size={20} />
//           </button>

//           {showMenu && (
//             <div className="absolute right-0 top-10 bg-white rounded-md shadow-lg py-2 w-36 z-10 options-menu border border-gray-200">
//               <button
//                 onClick={handleEdit}
//                 className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
//               >
//                 <Edit size={16} className="mr-2 text-blue-500" />
//                 <span>Edit</span>
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-50 transition"
//               >
//                 <Trash2 size={16} className="mr-2 text-red-500" />
//                 <span>Delete</span>
//               </button>
//             </div>
//           )}
//         </div>
//       }

//       <div className="absolute right-4 bottom-5 flex flex-col items-center gap-3">
//         <button
//           onClick={handleLikeToggle}
//           className={`flex items-center justify-center p-2.5 bg-white bg-opacity-30 rounded-full hover:bg-red-500 hover:text-white transition-all backdrop-blur-sm shadow-md ${isLiked ? 'bg-red-500' : ''}`}
//         >
//           <FaHeart className={`${isLiked ? 'text-white' : 'text-red-500 hover:text-white'}`} size={18} />
//           <span className={`text-xs ml-1.5 font-medium ${isLiked ? 'text-white' : 'text-gray-800'}`}>{likeCount}</span>
//         </button>
//         <button
//           onClick={() => setShowCommentModal(true)}
//           className="flex items-center justify-center p-2.5 bg-white bg-opacity-30 rounded-full hover:bg-blue-500 hover:text-white transition-all backdrop-blur-sm shadow-md"
//         >
//           <MessageCircle className="text-blue-500 hover:text-white" size={18} />
//           <span className="text-xs ml-1.5 text-gray-800 font-medium">{video.totalComments || 0}</span>
//         </button>
//         <button className="flex items-center justify-center p-2.5 bg-white bg-opacity-30 rounded-full hover:bg-yellow-500 hover:text-white transition-all backdrop-blur-sm shadow-md">
//           <Bookmark className="text-yellow-500 hover:text-white" size={18} />
//         </button>
//         <button className="flex items-center justify-center p-2.5 bg-white bg-opacity-30 rounded-full hover:bg-green-500 hover:text-white transition-all backdrop-blur-sm shadow-md">
//           <Share2 className="text-green-500 hover:text-white" size={18} />
//           <span className="text-xs ml-1.5 text-gray-800 font-medium">{video.totalShares || 0}</span>
//         </button>
//       </div>

//       {showEditModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold text-gray-800">Edit Video</h3>
//               <button
//                 onClick={() => setShowEditModal(false)}
//                 className="p-1 rounded-full hover:bg-gray-100 transition"
//               >
//                 <X className="text-gray-500" size={20} />
//               </button>
//             </div>

//             {error && (
//               <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
//                 {error}
//               </div>
//             )}

//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="title">
//                   Title
//                 </label>
//                 <input
//                   type="text"
//                   id="title"
//                   name="title"
//                   value={editForm.title}
//                   onChange={handleInputChange}
//                   className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="description">
//                   Description
//                 </label>
//                 <textarea
//                   id="description"
//                   name="description"
//                   value={editForm.description}
//                   onChange={handleInputChange}
//                   rows="3"
//                   className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="visibility">
//                   Visibility
//                 </label>
//                 <select
//                   id="visibility"
//                   name="visibility"
//                   value={editForm.visibility}
//                   onChange={handleInputChange}
//                   className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="public">Public</option>
//                   <option value="private">Private</option>
//                   <option value="followers">Followers</option>
//                 </select>
//               </div>

//               <div className="mb-4 grid grid-cols-2 gap-4">
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="allowDuet"
//                     name="allowDuet"
//                     checked={editForm.allowDuet}
//                     onChange={handleInputChange}
//                     className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
//                   />
//                   <label className="ml-2 text-sm text-gray-700" htmlFor="allowDuet">
//                     Allow Duet
//                   </label>
//                 </div>
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="allowStitch"
//                     name="allowStitch"
//                     checked={editForm.allowStitch}
//                     onChange={handleInputChange}
//                     className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
//                   />
//                   <label className="ml-2 text-sm text-gray-700" htmlFor="allowStitch">
//                     Allow Stitch
//                   </label>
//                 </div>
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="allowComments"
//                     name="allowComments"
//                     checked={editForm.allowComments}
//                     onChange={handleInputChange}
//                     className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
//                   />
//                   <label className="ml-2 text-sm text-gray-700" htmlFor="allowComments">
//                     Allow Comments
//                   </label>
//                 </div>
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="isActive"
//                     name="isActive"
//                     checked={editForm.isActive}
//                     onChange={handleInputChange}
//                     className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
//                   />
//                   <label className="ml-2 text-sm text-gray-700" htmlFor="isActive">
//                     Active
//                   </label>
//                 </div>
//               </div>

//               <div className="flex justify-end gap-3 mt-6">
//                 <button
//                   type="button"
//                   onClick={() => setShowEditModal(false)}
//                   className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
//                 >
//                   {isSubmitting ? 'Saving...' : 'Save Changes'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold text-gray-800">Delete Video</h3>
//               <button
//                 onClick={() => setShowDeleteConfirm(false)}
//                 className="p-1 rounded-full hover:bg-gray-100 transition"
//               >
//                 <X className="text-gray-500" size={20} />
//               </button>
//             </div>

//             <div className="text-gray-600 mb-6">
//               Are you sure you want to delete this video? This action cannot be undone.
//             </div>

//             <div className="flex justify-end gap-3">
//               <button
//                 type="button"
//                 onClick={() => setShowDeleteConfirm(false)}
//                 className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDelete}
//                 disabled={isDeleting}
//                 className={`px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition ${isDeleting ? 'opacity-75 cursor-not-allowed' : ''}`}
//               >
//                 {isDeleting ? 'Deleting...' : 'Delete'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showCommentModal && (
//         <CommentModal
//           isOpen={showCommentModal}
//           onClose={() => setShowCommentModal(false)}
//           video={video}
//         />
//       )}
//     </div>
//   );
// };

// export default ProfileVideoCard;


import { Bookmark, MessageCircle, Share2, MoreHorizontal, Edit, Trash2, X } from 'lucide-react';
import React, { useRef, useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa6';
import axios from 'axios';
import { toast } from 'react-toastify';
import CommentModal from './VideoCommentModal';
import VideoShareModal from './VideoShareModal';

const ProfileVideoCard = ({ video, onVideoUpdate, fetchUserVideos }) => {

  const videoRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video?.totalLikes || 0);
  const [editForm, setEditForm] = useState({
    title: video?.title || '',
    description: video?.description || '',
    visibility: video?.visibility || 'public',
    allowDuet: video?.allowDuet !== undefined ? video?.allowDuet : true,
    allowStitch: video?.allowStitch !== undefined ? video?.allowStitch : true,
    allowComments: video?.allowComments !== undefined ? video?.allowComments : true,
    isActive: video?.isActive !== undefined ? video?.isActive : true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const userId = localStorage.getItem("userId");
  const authToken = localStorage.getItem("authToken");

  const videoSrc = video.videoUrl;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current) {
            if (entry.isIntersecting) {
              videoRef.current.play();
            } else {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('.options-menu')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleLikeToggle = async () => {
    try {
      if (isLiked) {
        const response = await axios.delete(
          `https://jaitok-api.jaitia.com/interactions/interactions/videos/${video.id}/unlike`,
          {
            headers: {
              'Accept': 'application/json',
              'access-token': authToken
            }
          }
        );

        if (response.data.success) {
          setIsLiked(false);
          setLikeCount(prev => Math.max(0, prev - 1));
          toast.success("Video unliked successfully!");
        }
      } else {
        const response = await axios.post(
          `https://jaitok-api.jaitia.com/interactions/interactions/videos/${video.id}/like`,
          {},
          {
            headers: {
              'Accept': 'application/json',
              'access-token': authToken
            }
          }
        );

        if (response.data.success) {
          setIsLiked(true);
          setLikeCount(prev => prev + 1);
          toast.success("Video liked successfully!");
        }
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      toast.error(err.response?.data?.message || 'Failed to update like status. Please try again.');
    }
  };

  const handleEdit = () => {
    setEditForm({
      title: video?.title || '',
      description: video?.description || '',
      visibility: video?.visibility || 'public',
      allowDuet: video?.allowDuet !== undefined ? video?.allowDuet : true,
      allowStitch: video?.allowStitch !== undefined ? video?.allowStitch : true,
      allowComments: video?.allowComments !== undefined ? video?.allowComments : true,
      isActive: video?.isActive !== undefined ? video?.isActive : true
    });
    setShowEditModal(true);
    setShowMenu(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
    setShowMenu(false);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await axios.delete(
        `https://jaitok-api.jaitia.com/interactions/videos/${video.id}`,
        {
          headers: {
            'Accept': 'application/json',
            'access-token': authToken
          }
        }
      );

      if (response.data.success) {
        toast.success("Video deleted successfully!");
        if (typeof fetchUserVideos === 'function') {
          fetchUserVideos();
        }
        setShowDeleteConfirm(false);
      } else {
        throw new Error(response.data.message || 'Failed to delete video');
      }
    } catch (err) {
      console.error('Error deleting video:', err);
      toast.error(err.response?.data?.message || 'Failed to delete video. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.patch(
        `https://jaitok-api.jaitia.com/interactions/videos/${video.id}`,
        {
          title: editForm.title,
          description: editForm.description,
          visibility: editForm.visibility,
          allowDuet: editForm.allowDuet,
          allowStitch: editForm.allowStitch,
          allowComments: editForm.allowComments,
          isActive: editForm.isActive
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'access-token': authToken
          }
        }
      );

      if (response.data.success) {
        if (typeof onVideoUpdate === 'function') {
          onVideoUpdate(video.id, response.data.data);
        }
        if (typeof fetchUserVideos === 'function') {
          fetchUserVideos();
        }
        setShowEditModal(false);
        toast.success("Video updated successfully!");
      } else {
        throw new Error(response.data.message || 'Failed to update video');
      }
    } catch (err) {
      console.error('Error updating video:', err);
      setError(err.response?.data?.message || 'Failed to update video. Please try again.');
      toast.error(err.response?.data?.message || 'Failed to update video. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative rounded-xl shadow-lg overflow-hidden group bg-white border border-gray-200">
      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full h-[450px] object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        preload="auto"
        onError={(e) => console.error("Video failed to load", e)}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black to-gray-900 opacity-50 group-hover:opacity-70 transition-all"></div>

      <div className="absolute bottom-5 left-4 text-white pr-16">
        <h3 className="font-bold text-lg truncate">{video.title}</h3>
        <p className="text-sm text-gray-100 line-clamp-2">{video.description}</p>
      </div>

      {userId === video.user?.id && (
        <div className="absolute top-4 right-4 options-menu">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center justify-center p-2 bg-white bg-opacity-30 rounded-full hover:bg-opacity-100 transition shadow-md"
          >
            <MoreHorizontal className="text-gray-100 hover:text-gray-900" size={20} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-10 bg-white rounded-md shadow-lg py-2 w-36 z-10 options-menu border border-gray-200">
              <button
                onClick={handleEdit}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
              >
                <Edit size={16} className="mr-2 text-blue-500" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-50 transition"
              >
                <Trash2 size={16} className="mr-2 text-red-500" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      )}

      <div className="absolute right-4 bottom-5 flex flex-col items-center gap-3">
        <button
          onClick={handleLikeToggle}
          className={`flex items-center justify-center p-2.5 bg-white bg-opacity-30 rounded-full hover:bg-red-500 hover:text-white transition-all backdrop-blur-sm shadow-md ${isLiked ? 'bg-red-500' : ''}`}
        >
          <FaHeart className={`${isLiked ? 'text-white' : 'text-red-500 hover:text-white'}`} size={18} />
          <span className={`text-xs ml-1.5 font-medium ${isLiked ? 'text-white' : 'text-gray-800'}`}>{likeCount}</span>
        </button>
        <button
          onClick={() => setShowCommentModal(true)}
          className="flex items-center justify-center p-2.5 bg-white bg-opacity-30 rounded-full hover:bg-blue-500 hover:text-white transition-all backdrop-blur-sm shadow-md"
        >
          <MessageCircle className="text-blue-500 hover:text-white" size={18} />
          <span className="text-xs ml-1.5 text-gray-800 font-medium">{video.totalComments || 0}</span>
        </button>
        <button className="flex items-center justify-center p-2.5 bg-white bg-opacity-30 rounded-full hover:bg-yellow-500 hover:text-white transition-all backdrop-blur-sm shadow-md">
          <Bookmark className="text-yellow-500 hover:text-white" size={18} />
        </button>
        {/* <button className="flex items-center justify-center p-2.5 bg-white bg-opacity-30 rounded-full hover:bg-green-500 hover:text-white transition-all backdrop-blur-sm shadow-md">
          <Share2 className="text-green-500 hover:text-white" size={18} />
          <span className="text-xs ml-1.5 text-gray-800 font-medium">{video.totalShares || 0}</span>
        </button> */}
         <button
          onClick={() => setShowShareModal(true)}
          className={`flex items-center justify-center p-2.5 rounded-full transition-all backdrop-blur-sm shadow-md ${
            video.totalShares > 0 ? 'bg-green-500' : 'bg-white bg-opacity-30 hover:bg-green-500'
          }`}
        >
          <Share2 className={video.totalShares > 0 ? 'text-white' : 'text-green-500'} size={18} />
          <span className={`text-xs ml-1.5 font-medium ${video.totalShares > 0 ? 'text-white' : 'text-gray-800'}`}>
            {video.totalShares || 0}
          </span>
        </button>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Edit Video</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition"
              >
                <X className="text-gray-500" size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="title">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={editForm.title}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={editForm.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="visibility">
                  Visibility
                </label>
                <select
                  id="visibility"
                  name="visibility"
                  value={editForm.visibility}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="followers">Followers</option>
                </select>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowDuet"
                    name="allowDuet"
                    checked={editForm.allowDuet}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700" htmlFor="allowDuet">
                    Allow Duet
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowStitch"
                    name="allowStitch"
                    checked={editForm.allowStitch}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700" htmlFor="allowStitch">
                    Allow Stitch
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowComments"
                    name="allowComments"
                    checked={editForm.allowComments}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700" htmlFor="allowComments">
                    Allow Comments
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={editForm.isActive}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700" htmlFor="isActive">
                    Active
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Delete Video</h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition"
              >
                <X className="text-gray-500" size={20} />
              </button>
            </div>

            <div className="text-gray-600 mb-6">
              Are you sure you want to delete this video? This action cannot be undone.
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className={`px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition ${isDeleting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCommentModal && (
        <CommentModal
          isOpen={showCommentModal}
          onClose={() => setShowCommentModal(false)}
          video={video}
        />
      )}

<VideoShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        video={video}
        onShareSuccess={() => {
          if (typeof onVideoUpdate === 'function') {
            onVideoUpdate(video.id, { ...video, totalShares: (video.totalShares || 0) + 1 });
          }
        }}
      />
    </div>
  );
};

export default ProfileVideoCard;