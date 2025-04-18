import React, { useState, useEffect } from "react";
import { X, Heart, Send, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

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

const CommentModal = ({ isOpen, onClose, video, onCommentPosted }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showReplies, setShowReplies] = useState({});
  const [showAllReplies, setShowAllReplies] = useState(false);
  const limit = 10;

  useEffect(() => {
    if (isOpen && video?.id) {
      fetchComments();
      // Prevent body scroll when modal is open on mobile/tablet
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

  try {
    setLoading(true);
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      toast.error("Please log in to view comments.");
      return;
    }

    const response = await axios.get(
      `https://jaitok-api.jaitia.com/query/videos/${video.id}/comments`,
      {
        params: { page, limit },
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json",
          "access-token": authToken,
        },
      }
    );

    const fetchedComments = Array.isArray(response.data.data.comments)
      ? response.data.data.comments
      : [];

    // Fetch avatars for users in parallel
    const uniqueUserIds = [
      ...new Set(
        fetchedComments.flatMap((comment) => [
          comment.userId,
          ...comment.replies?.map((r) => r.userId) || [],
        ])
      ),
    ];

    const userPromises = uniqueUserIds.map((userId) =>
      axios
        .get(`https://jaitok-api.jaitia.com/query/users/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
            "access-token": authToken,
          },
        })
        .then((res) => ({
          userId,
          avatar: res.data?.data?.avatar,
        }))
        .catch(() => ({
          userId,
          avatar: null,
        }))
    );

    const userAvatars = await Promise.all(userPromises);
    const avatarMap = Object.fromEntries(userAvatars.map((u) => [u.userId, u.avatar]));

    // Attach avatars to comments and replies
    const groupedComments = fetchedComments.map((comment) => ({
      ...comment,
      user: {
        ...comment.user,
        avatar: avatarMap[comment.userId] || null,
      },
      replies: comment.replies?.map((reply) => ({
        ...reply,
        user: {
          ...reply.user,
          avatar: avatarMap[reply.userId] || null,
        },
      })) || [],
    }));

    setComments(page === 1 ? groupedComments : [...comments, ...groupedComments]);
  } catch (error) {
    console.error("Error fetching comments:", error);
    toast.error(error.response?.data?.message || "Failed to load comments");
  } finally {
    setLoading(false);
  }
};


  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        toast.error("Please log in to comment.");
        return;
      }

      const payload = {
        content: newComment.trim(),
      };

      if (replyingTo?.id) {
        payload.parentId = replyingTo.id;
      }

      const response = await axios.post(
        `https://jaitok-api.jaitia.com/interactions/interactions/videos/${video.id}/comments`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
            "access-token": authToken,
          },
        }
      );

      if (response.data.success) {
        setNewComment(""); 
        setReplyingTo(null);
        setPage(1);
        fetchComments();
        toast.success("Comment posted successfully!");
        if (onCommentPosted) onCommentPosted();
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error(error.response?.data?.message || "Failed to post comment");
    }
  };

  const handleLike = async (commentId) => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        toast.error("Please log in to like comments.");
        return;
      }

      const response = await axios.post(
        `https://jaitok-api.jaitia.com/interactions/comments/${commentId}/like`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
            "access-token": authToken,
          },
        }
      );

      console.log("Like response:", response.data);

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, likes: (comment.likes || 0) + 1 }
            : comment
        )
      );
    } catch (error) {
      console.error("Error liking comment:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        toast.error(error.response.data.message || "Failed to like comment");
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("No response received from the server.");
      } else {
        console.error("Error setting up the request:", error.message);
        toast.error("Failed to like comment");
      }
    }
  };

  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const toggleAllReplies = () => {
    setShowAllReplies((prev) => !prev);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      <div className={`
        fixed bg-white shadow-lg flex flex-col z-50
        /* Mobile & Tablet (default) */
        inset-x-0 bottom-0 h-[80vh] rounded-t-2xl
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        
        /* Desktop (1024px and up) */
        lg:right-0 lg:top-0 lg:left-auto lg:w-[400px] lg:h-screen lg:rounded-none
        lg:transform-none
      `}>
        <div className="lg:hidden w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-2" />
        
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Comments ({comments.length})</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#FE2C55] border-t-transparent"></div>
            </div>
          ) : (
            <>
              {comments.length > 0 ? comments.map((comment) => (
                <div key={comment.id} className="space-y-4">
                  <div className="flex space-x-3">
                    <img
                      src={comment.user?.avatar || `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl8UcJiZxXc_q-Zr-1dohkW5sd8lTxvpPj-g&s`}
                      alt={comment.user?.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-sm">
                            {comment.user?.username || "Anonymous"}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {timeAgo(comment.createdAt)}
                          </span> 
                        </div>
                        <p className="text-sm">{comment.content}</p>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleLike(comment.id)}
                            className="flex items-center space-x-1 text-gray-500 hover:text-[#FE2C55] transition-colors"
                          >
                            <Heart size={16} />
                            <span className="text-xs">{comment.likes || 0}</span>
                          </button>
                          <button
                            onClick={() => setReplyingTo(comment)}
                            className="text-xs text-gray-500 hover:text-[#FE2C55] transition-colors"
                          >
                            Reply
                          </button>
                          {comment.replies?.length > 0 && (
                            <button
                              onClick={() => toggleReplies(comment.id)}
                              className="text-xs text-gray-500 hover:text-[#FE2C55] transition-colors"
                            >
                              {showReplies[comment.id] || showAllReplies ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                              <span className="ml-1">
                                {comment.replies.length} Show replies
                              </span>
                            </button>
                          )}
                        </div>
                      </div>

                      {(showReplies[comment.id] || showAllReplies) &&
                        comment.replies?.length > 0 && (
                          <div className="mt-4 ml-6 space-y-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex space-x-3">
                                <img
                                  src={reply.user?.avatar || `https://source.unsplash.com/random/100x100?face=${reply.id}`}
                                  alt={reply.user?.username}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                      <h3 className="font-semibold text-sm">
                                        {reply.user?.username || "Anonymous"}
                                      </h3>
                                      <span className="text-xs text-gray-500">
                                        {timeAgo(reply.createdAt)}
                                      </span>
                                    </div>
                                    <p className="text-sm">{reply.content}</p>
                                    <button
                                      onClick={() => handleLike(reply.id)}
                                      className="flex items-center space-x-1 text-gray-500 hover:text-[#FE2C55] transition-colors"
                                    >
                                      <Heart size={16} />
                                      <span className="text-xs">
                                        {reply.likes || 0}
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              )) : (
                <p>No comments yet!</p>
              )}

              {!loading && comments.length >= page * limit && (
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="w-full py-2 text-[#FE2C55] hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Load more comments
                </button>
              )}
            </>
          )}
        </div>

        <form onSubmit={submitComment} className="border-t p-4">
          {replyingTo && (
            <div className="flex items-center justify-between mb-2 px-3 py-1 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">
                Replying to {replyingTo.user?.username}
              </span>
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            </div>
          )}
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#FE2C55] focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="p-2 text-[#FE2C55] disabled:text-gray-400 transition-colors"
            >
              <Send size={24} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CommentModal;