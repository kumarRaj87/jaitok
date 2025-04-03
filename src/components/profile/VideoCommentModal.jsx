

// import React, { useState, useEffect, useRef } from 'react';
// import { X, Heart, Trash2, CornerDownRight, Send } from 'lucide-react';
// import { format } from 'date-fns';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const CommentModal = ({ isOpen, onClose, video }) => {
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState('');
//   const [replyTo, setReplyTo] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const videoRef = useRef(null);
//   const modalRef = useRef(null);
//   const commentInputRef = useRef(null);

//   useEffect(() => {
//     if (isOpen) {
//       fetchComments();
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }

//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen, video?.id]);

//   const fetchComments = async () => {
//     if (!video?.id) return;
    
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('authToken');
//       const response = await axios.get(
//         `https://jaitok-api.jaitia.com/query/videos/${video.id}/comments`,
//         {
//           headers: {
//             'access-token': token
//           }
//         }
//       );
      
//       // Ensure we always have an array, even if response.data is undefined or null
//       const commentsData = Array.isArray(response?.data) ? response.data : [];
//       setComments(commentsData);
//     } catch (error) {
//       console.error('Error fetching comments:', error);
//       toast.error('Failed to load comments');
//       setComments([]); // Reset to empty array on error
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmitComment = async (e) => {
//     e.preventDefault();
//     if (!newComment.trim() || !video?.id) return;

//     try {
//       const token = localStorage.getItem('authToken');
//       const userId = localStorage.getItem('userId');
      
//       if (!token || !userId) {
//         toast.error('Authentication required');
//         return;
//       }

//       const payload = {
//         content: newComment,
//         parentId: replyTo?.id || null
//       };

//       const response = await axios.post(
//         `https://jaitok-api.jaitia.com/query/videos/${video.id}/comments`,
//         payload,
//         {
//           headers: {
//             'access-token': token,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data) {
//         setComments(prev => {
//           const newCommentWithUser = {
//             ...response.data,
//             user: {
//               id: userId,
//               username: localStorage.getItem('username') || 'Anonymous',
//               avatar: localStorage.getItem('avatar') || 'https://via.placeholder.com/40'
//             },
//             likes: 0,
//             isLiked: false,
//             createdAt: new Date().toISOString()
//           };
          
//           return replyTo?.id 
//             ? prev.map(comment => 
//                 comment.id === replyTo.id
//                   ? { 
//                       ...comment, 
//                       replies: [...(comment.replies || []), newCommentWithUser] 
//                     }
//                   : comment
//               )
//             : [newCommentWithUser, ...prev];
//         });
//       }

//       setNewComment('');
//       setReplyTo(null);
//       toast.success(replyTo ? 'Reply posted successfully!' : 'Comment posted successfully!');
//     } catch (error) {
//       console.error('Error posting comment:', error);
//       toast.error('Failed to post comment');
//     }
//   };

//   const handleLikeUnlikeComment = async (commentId, isCurrentlyLiked) => {
//     try {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         toast.error('Please login to like comments');
//         return;
//       }

//       const endpoint = isCurrentlyLiked ? 'unlike' : 'like';
      
//       await axios.post(
//         `https://jaitok-api.jaitia.com/interactions/comments/${commentId}/${endpoint}`,
//         {},
//         {
//           headers: {
//             'access-token': token
//           }
//         }
//       );

//       setComments(prev =>
//         prev.map(comment => {
//           // Handle main comment
//           if (comment.id === commentId) {
//             return { 
//               ...comment, 
//               likes: isCurrentlyLiked ? (comment.likes || 0) - 1 : (comment.likes || 0) + 1, 
//               isLiked: !isCurrentlyLiked 
//             };
//           }
          
//           // Handle replies if they exist
//           if (comment.replies) {
//             const updatedReplies = comment.replies.map(reply => {
//               if (reply.id === commentId) {
//                 return { 
//                   ...reply, 
//                   likes: isCurrentlyLiked ? (reply.likes || 0) - 1 : (reply.likes || 0) + 1, 
//                   isLiked: !isCurrentlyLiked 
//                 };
//               }
//               return reply;
//             });
//             return { ...comment, replies: updatedReplies };
//           }
          
//           return comment;
//         })
//       );
//     } catch (error) {
//       console.error('Error toggling comment like:', error);
//       toast.error(`Failed to ${isCurrentlyLiked ? 'unlike' : 'like'} comment`);
//     }
//   };

//   const handleDeleteComment = async (commentId) => {
//     try {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         toast.error('Authentication required');
//         return;
//       }

//       await axios.delete(
//         `https://jaitok-api.jaitia.com/interactions/comments/${commentId}`,
//         {
//           headers: {
//             'access-token': token
//           }
//         }
//       );

//       setComments(prev => 
//         prev.filter(comment => comment.id !== commentId)
//           .map(comment => {
//             if (comment.replies) {
//               return {
//                 ...comment,
//                 replies: comment.replies.filter(reply => reply.id !== commentId)
//               };
//             }
//             return comment;
//           })
//       );
//       toast.success('Comment deleted successfully!');
//     } catch (error) {
//       console.error('Error deleting comment:', error);
//       toast.error('Failed to delete comment');
//     }
//   };

//   const handleReply = (comment) => {
//     setReplyTo(comment);
//     setTimeout(() => {
//       commentInputRef.current?.focus();
//     }, 100);
//   };

//   if (!isOpen) return null;

//   const renderComment = (comment, isReply = false) => (
//     <div key={comment.id} className={`space-y-2 ${isReply ? 'ml-11' : ''}`}>
//       <div className="flex items-start space-x-3">
//         {isReply && <CornerDownRight size={16} className="text-gray-400 mt-2" />}
//         <img
//           src={comment.user?.avatar || 'https://via.placeholder.com/40'}
//           alt={comment.user?.username || 'Anonymous'}
//           className="w-8 h-8 rounded-full"
//         />
//         <div className="flex-1">
//           <div className="bg-gray-100 rounded-lg p-3">
//             <div className="font-semibold">{comment.user?.username || 'Anonymous'}</div>
//             <p className="text-gray-700">{comment.content}</p>
//           </div>
//           <div className="flex items-center space-x-4 mt-2 text-sm">
//             <span className="text-gray-500">
//               {comment.createdAt ? format(new Date(comment.createdAt), 'MMM d, yyyy') : 'Just now'}
//             </span>
//             <button
//               onClick={() => handleLikeUnlikeComment(comment.id, comment.isLiked)}
//               className="flex items-center space-x-1 text-gray-500 hover:text-red-500"
//             >
//               <Heart
//                 size={16}
//                 className={comment.isLiked ? 'fill-red-500 text-red-500' : ''}
//               />
//               <span>{comment.likes || 0}</span>
//             </button>
//             <button
//               onClick={() => handleReply(comment)}
//               className="text-gray-500 hover:text-blue-500"
//             >
//               Reply
//             </button>
//             {comment.user?.id === localStorage.getItem('userId') && (
//               <button
//                 onClick={() => handleDeleteComment(comment.id)}
//                 className="text-gray-500 hover:text-red-500"
//               >
//                 <Trash2 size={16} />
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 w-full">
//       <div 
//         ref={modalRef}
//         className="bg-white w-[100vw] h-[100vh]  flex overflow-hidden "
//       >
//         <div className="w-[70%] h-full flex justify-center items-center bg-black">
//           <video
//             ref={videoRef}
//             src={video?.videoUrl}
//             className="w-[100%] h-[90%] object-contain rounded-md"
//             controls
//             autoPlay
//             loop
//             muted={false}
//             playsInline
//           />
//         </div>

//         <div className="w-[30%] flex flex-col">
//           <div className="p-4 border-b flex justify-between items-center">
//             <h3 className="text-xl font-semibold">Comments</h3>
//             <button
//               onClick={onClose}
//               className="p-1 hover:bg-gray-100 rounded-full transition"
//             >
//               <X size={24} />
//             </button>
//           </div>

//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             {loading ? (
//               <div className="flex justify-center items-center h-full">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//               </div>
//             ) : comments.length === 0 ? (
//               <div className="text-center text-gray-500 mt-8">
//                 No comments yet. Be the first to comment!
//               </div>
//             ) : (
//               comments.map(comment => (
//                 <React.Fragment key={comment.id}>
//                   {renderComment(comment)}
//                   {comment.replies?.map(reply => renderComment(reply, true))}
//                 </React.Fragment>
//               ))
//             )}
//           </div>

//           <div className="p-4 border-t">
//             {replyTo && (
//               <div className="flex items-center justify-between bg-gray-100 p-2 rounded-lg mb-2">
//                 <span className="text-sm text-gray-600">
//                   Replying to <span className="font-semibold">{replyTo.user?.username || 'Anonymous'}</span>
//                 </span>
//                 <button
//                   onClick={() => setReplyTo(null)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <X size={16} />
//                 </button>
//               </div>
//             )}
//             <form onSubmit={handleSubmitComment} className="flex items-center space-x-2">
//               <input
//                 ref={commentInputRef}
//                 type="text"
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
//                 className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:border-blue-500"
//                 required
//               />
//               <button
//                 type="submit"
//                 disabled={!newComment.trim()}
//                 className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <Send size={20} />
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CommentModal;



import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Trash2, CornerDownRight, Send, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Utility function to calculate time since the comment was posted
const timeAgo = (date) => {
  const now = new Date();
  const commentDate = new Date(date);
  const seconds = Math.floor((now - commentDate) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval} year${interval === 1 ? "" : "s"} ago`;

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} month${interval === 1 ? "" : "s"} ago`;

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} day${interval === 1 ? "" : "s"} ago`;

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} hour${interval === 1 ? "" : "s"} ago`;

  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval} minute${interval === 1 ? "" : "s"} ago`;

  return `${Math.floor(seconds)} second${seconds === 1 ? "" : "s"} ago`;
};

const CommentModal = ({ isOpen, onClose, video }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showReplies, setShowReplies] = useState({});
  const limit = 10;
  const modalRef = useRef(null);
  const commentInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && video?.id) {
      fetchComments();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, video?.id, page]);

  const fetchComments = async () => {
    if (!video?.id) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(
        `https://jaitok-api.jaitia.com/query/videos/${video.id}/comments`,
        {
          params: { page, limit },
          headers: {
            'access-token': token
          }
        }
      );
      
      const commentsData = Array.isArray(response?.data?.data?.comments) ? response.data.data.comments : [];
      const groupedComments = commentsData.map((comment) => ({
        ...comment,
        replies: comment.replies || [],
      }));

      setComments(page === 1 ? groupedComments : [...comments, ...groupedComments]);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !video?.id) return;

    try {
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        toast.error('Authentication required');
        return;
      }

      const payload = {
        content: newComment,
        parentId: replyingTo?.id || null
      };

      const response = await axios.post(
        `https://jaitok-api.jaitia.com/query/videos/${video.id}/comments`,
        payload,
        {
          headers: {
            'access-token': token,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setComments(prev => {
          const newCommentWithUser = {
            ...response.data,
            user: {
              id: userId,
              username: localStorage.getItem('username') || 'Anonymous',
              avatar: localStorage.getItem('avatar') || 'https://via.placeholder.com/40'
            },
            likes: 0,
            isLiked: false,
            createdAt: new Date().toISOString()
          };
          
          return replyingTo?.id 
            ? prev.map(comment => 
                comment.id === replyingTo.id
                  ? { 
                      ...comment, 
                      replies: [...(comment.replies || []), newCommentWithUser] 
                    }
                  : comment
              )
            : [newCommentWithUser, ...prev];
        });
      }

      setNewComment('');
      setReplyingTo(null);
      toast.success(replyingTo ? 'Reply posted successfully!' : 'Comment posted successfully!');
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    }
  };

  const handleLikeUnlikeComment = async (commentId, isCurrentlyLiked) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Please login to like comments');
        return;
      }

      const endpoint = isCurrentlyLiked ? 'unlike' : 'like';
      
      await axios.post(
        `https://jaitok-api.jaitia.com/interactions/comments/${commentId}/${endpoint}`,
        {},
        {
          headers: {
            'access-token': token
          }
        }
      );

      setComments(prev =>
        prev.map(comment => {
          if (comment.id === commentId) {
            return { 
              ...comment, 
              likes: isCurrentlyLiked ? (comment.likes || 0) - 1 : (comment.likes || 0) + 1, 
              isLiked: !isCurrentlyLiked 
            };
          }
          
          if (comment.replies) {
            const updatedReplies = comment.replies.map(reply => {
              if (reply.id === commentId) {
                return { 
                  ...reply, 
                  likes: isCurrentlyLiked ? (reply.likes || 0) - 1 : (reply.likes || 0) + 1, 
                  isLiked: !isCurrentlyLiked 
                };
              }
              return reply;
            });
            return { ...comment, replies: updatedReplies };
          }
          
          return comment;
        })
      );
    } catch (error) {
      console.error('Error toggling comment like:', error);
      toast.error(`Failed to ${isCurrentlyLiked ? 'unlike' : 'like'} comment`);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      await axios.delete(
        `https://jaitok-api.jaitia.com/interactions/comments/${commentId}`,
        {
          headers: {
            'access-token': token
          }
        }
      );

      setComments(prev => 
        prev.filter(comment => comment.id !== commentId)
          .map(comment => {
            if (comment.replies) {
              return {
                ...comment,
                replies: comment.replies.filter(reply => reply.id !== commentId)
              };
            }
            return comment;
          })
      );
      toast.success('Comment deleted successfully!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  if (!isOpen) return null;

  // For large screens (lg and up)
  if (window.innerWidth >= 1024) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 w-full">
        <div 
          ref={modalRef}
          className="bg-white w-[100vw] h-[100vh] flex overflow-hidden lg:w-[80vw] lg:h-[80vh] lg:rounded-xl"
        >
          <div className="w-[80%] h-full flex justify-center items-center bg-black">
            <video
              src={video?.videoUrl}
              className="w-[100%] h-[90%] object-contain rounded-md"
              controls
              autoPlay
              loop
              muted={false}
              playsInline
            />
          </div>

          <div className="w-[30%] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold">Comments ({comments.length})</h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  No comments yet. Be the first to comment!
                </div>
              ) : (
                comments.map((comment) => (
                  <React.Fragment key={comment.id}>
                    {/* Main Comment */}
                    <div className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <img
                          src={comment.user?.avatar || 'https://via.placeholder.com/40'}
                          alt={comment.user?.username || 'Anonymous'}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="bg-gray-100 rounded-lg p-3">
                            <div className="font-semibold text-sm">{comment.user?.username || 'Anonymous'}</div>
                            <p className="text-gray-700 text-sm">{comment.content}</p>
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <span className="text-gray-500 text-xs">
                              {timeAgo(comment.createdAt)}
                            </span>
                            <button
                              onClick={() => handleLikeUnlikeComment(comment.id, comment.isLiked)}
                              className="flex items-center space-x-1 text-gray-500 hover:text-red-500"
                            >
                              <Heart
                                size={16}
                                className={comment.isLiked ? 'fill-red-500 text-red-500' : ''}
                              />
                              <span>{comment.likes || 0}</span>
                            </button>
                            <button
                              onClick={() => setReplyingTo(comment)}
                              className="text-gray-500 hover:text-blue-500 text-xs"
                            >
                              Reply
                            </button>
                            {comment.replies?.length > 0 && (
                              <button
                                onClick={() => toggleReplies(comment.id)}
                                className="text-gray-500 hover:text-blue-500 text-xs flex items-center"
                              >
                                {showReplies[comment.id] ? (
                                  <ChevronUp size={16} />
                                ) : (
                                  <ChevronDown size={16} />
                                )}
                                <span className="ml-1">
                                  {comment.replies.length} replies
                                </span>
                              </button>
                            )}
                            {comment.user?.id === localStorage.getItem('userId') && (
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-gray-500 hover:text-red-500"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Replies */}
                      {showReplies[comment.id] && comment.replies?.length > 0 && (
                        <div className="ml-12 mt-3 space-y-3">
                          {comment.replies.map(reply => (
                            <div key={reply.id} className="flex items-start space-x-3">
                              <CornerDownRight size={16} className="text-gray-400 mt-2 flex-shrink-0" />
                              <img
                                src={reply.user?.avatar || 'https://via.placeholder.com/40'}
                                alt={reply.user?.username || 'Anonymous'}
                                className="w-8 h-8 rounded-full"
                              />
                              <div className="flex-1">
                                <div className="bg-gray-100 rounded-lg p-3">
                                  <div className="font-semibold text-sm">{reply.user?.username || 'Anonymous'}</div>
                                  <p className="text-gray-700 text-sm">{reply.content}</p>
                                </div>
                                <div className="flex items-center space-x-4 mt-2 text-sm">
                                  <span className="text-gray-500 text-xs">
                                    {timeAgo(reply.createdAt)}
                                  </span>
                                  <button
                                    onClick={() => handleLikeUnlikeComment(reply.id, reply.isLiked)}
                                    className="flex items-center space-x-1 text-gray-500 hover:text-red-500"
                                  >
                                    <Heart
                                      size={16}
                                      className={reply.isLiked ? 'fill-red-500 text-red-500' : ''}
                                    />
                                    <span>{reply.likes || 0}</span>
                                  </button>
                                  <button
                                    onClick={() => setReplyingTo(reply)}
                                    className="text-gray-500 hover:text-blue-500 text-xs"
                                  >
                                    Reply
                                  </button>
                                  {reply.user?.id === localStorage.getItem('userId') && (
                                    <button
                                      onClick={() => handleDeleteComment(reply.id)}
                                      className="text-gray-500 hover:text-red-500"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                ))
              )}
            </div>

            <div className="p-4 border-t">
              {replyingTo && (
                <div className="flex items-center justify-between bg-gray-100 p-2 rounded-lg mb-2">
                  <span className="text-sm text-gray-600">
                    Replying to <span className="font-semibold">{replyingTo.user?.username || 'Anonymous'}</span>
                  </span>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              <form onSubmit={handleSubmitComment} className="flex items-center space-x-2">
                <input
                  ref={commentInputRef}
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
                  className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 text-sm"
                  required
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For tablet and mobile screens
  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        ref={modalRef}
        className={`
          fixed bg-white flex flex-col z-50
          inset-x-0 bottom-0 h-[80vh] rounded-t-2xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        {/* Mobile drag handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-2" />
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-semibold">Comments ({comments.length})</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            comments.map((comment) => (
              <React.Fragment key={comment.id}>
                {/* Main Comment */}
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <img
                      src={comment.user?.avatar || 'https://via.placeholder.com/40'}
                      alt={comment.user?.username || 'Anonymous'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="font-semibold text-sm">{comment.user?.username || 'Anonymous'}</div>
                        <p className="text-gray-700 text-sm">{comment.content}</p>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <span className="text-gray-500 text-xs">
                          {timeAgo(comment.createdAt)}
                        </span>
                        <button
                          onClick={() => handleLikeUnlikeComment(comment.id, comment.isLiked)}
                          className="flex items-center space-x-1 text-gray-500 hover:text-red-500"
                        >
                          <Heart
                            size={16}
                            className={comment.isLiked ? 'fill-red-500 text-red-500' : ''}
                          />
                          <span>{comment.likes || 0}</span>
                        </button>
                        <button
                          onClick={() => setReplyingTo(comment)}
                          className="text-gray-500 hover:text-blue-500 text-xs"
                        >
                          Reply
                        </button>
                        {comment.replies?.length > 0 && (
                          <button
                            onClick={() => toggleReplies(comment.id)}
                            className="text-gray-500 hover:text-blue-500 text-xs flex items-center"
                          >
                            {showReplies[comment.id] ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                            <span className="ml-1">
                              {comment.replies.length} replies
                            </span>
                          </button>
                        )}
                        {comment.user?.id === localStorage.getItem('userId') && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Replies */}
                  {showReplies[comment.id] && comment.replies?.length > 0 && (
                    <div className="ml-12 mt-3 space-y-3">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="flex items-start space-x-3">
                          <CornerDownRight size={16} className="text-gray-400 mt-2 flex-shrink-0" />
                          <img
                            src={reply.user?.avatar || 'https://via.placeholder.com/40'}
                            alt={reply.user?.username || 'Anonymous'}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="bg-gray-100 rounded-lg p-3">
                              <div className="font-semibold text-sm">{reply.user?.username || 'Anonymous'}</div>
                              <p className="text-gray-700 text-sm">{reply.content}</p>
                            </div>
                            <div className="flex items-center space-x-4 mt-2 text-sm">
                              <span className="text-gray-500 text-xs">
                                {timeAgo(reply.createdAt)}
                              </span>
                              <button
                                onClick={() => handleLikeUnlikeComment(reply.id, reply.isLiked)}
                                className="flex items-center space-x-1 text-gray-500 hover:text-red-500"
                              >
                                <Heart
                                  size={16}
                                  className={reply.isLiked ? 'fill-red-500 text-red-500' : ''}
                                />
                                <span>{reply.likes || 0}</span>
                              </button>
                              <button
                                onClick={() => setReplyingTo(reply)}
                                className="text-gray-500 hover:text-blue-500 text-xs"
                              >
                                Reply
                              </button>
                              {reply.user?.id === localStorage.getItem('userId') && (
                                <button
                                  onClick={() => handleDeleteComment(reply.id)}
                                  className="text-gray-500 hover:text-red-500"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </React.Fragment>
            ))
          )}
        </div>

        {/* Comment Input */}
        <div className="p-4 border-t">
          {replyingTo && (
            <div className="flex items-center justify-between bg-gray-100 p-2 rounded-lg mb-2">
              <span className="text-sm text-gray-600">
                Replying to <span className="font-semibold">{replyingTo.user?.username || 'Anonymous'}</span>
              </span>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            </div>
          )}
          <form onSubmit={handleSubmitComment} className="flex items-center space-x-2">
            <input
              ref={commentInputRef}
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 text-sm"
              required
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CommentModal;