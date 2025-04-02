
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
  const [replyingTo, setReplyingTo] = useState(null); // Track which comment is being replied to
  const [showReplies, setShowReplies] = useState({}); // Track visibility of replies for each comment
  const [showAllReplies, setShowAllReplies] = useState(false); // Track global visibility of all replies
  const limit = 10;

  // Fetch comments when the modal opens or the page changes
  useEffect(() => {
    if (isOpen && video?.id) {
      fetchComments();
    }
  }, [isOpen, video?.id, page]);

  // Fetch comments from the API
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

      // Ensure comments are structured hierarchically (main comments and replies)
      const fetchedComments = Array.isArray(response.data.data.comments)
        ? response.data.data.comments
        : [];

      // Group replies under their respective main comments
      const groupedComments = fetchedComments.map((comment) => ({
        ...comment,
        replies: comment.replies || [], // Ensure replies exist
      }));

      setComments(page === 1 ? groupedComments : [...comments, ...groupedComments]);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error(error.response?.data?.message || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  // Submit a new comment or reply
  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        toast.error("Please log in to comment.");
        return;
      }

      // Prepare the payload
      const payload = {
        content: newComment.trim(),
      };

      // Add parentId only if replying to a comment
      if (replyingTo?.id) {
        payload.parentId = replyingTo.id; // Ensure parentId is a string
      }

      const response = await axios.post(
        `https://jaitok-api.jaitia.com/interactions/videos/${video.id}/comments`,
        payload, // Send the payload
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
        setReplyingTo(null); // Reset replyingTo after submitting
        setPage(1); // Reset to the first page to show the new comment
        fetchComments(); // Refresh the comments list
        toast.success("Comment posted successfully!");
        if (onCommentPosted) onCommentPosted(); // Notify parent component
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error(error.response?.data?.message || "Failed to post comment");
    }
  };

  // Handle liking a comment
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

      // Log the response for debugging
      console.log("Like response:", response.data);

      // Optimistically update the UI
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, likes: (comment.likes || 0) + 1 }
            : comment
        )
      );
    } catch (error) {
      console.error("Error liking comment:", error);

      // Log the full error response for debugging
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

  // Toggle visibility of replies for a specific comment
  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId], // Toggle visibility
    }));
  };

  // Toggle visibility of all replies globally
  const toggleAllReplies = () => {
    setShowAllReplies((prev) => !prev);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[400px] bg-white shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Comments ({comments.length})</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#FE2C55] border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Button to toggle all replies */}
            {/* <button
              onClick={toggleAllReplies}
              className="w-full py-2 text-[#FE2C55] hover:bg-gray-50 rounded-lg transition-colors"
            >
              {showAllReplies ? "Hide All Replies" : "Show All Replies"}
            </button> */}

            {comments.length > 0 ?
            comments.map((comment) => (
              <div key={comment.id} className="space-y-4">
                {/* Main Comment */}
                <div className="flex space-x-3">
                  <img
                    src={
                      comment.user?.avatar ||
                      `https://source.unsplash.com/random/100x100?face=${comment.id}`
                    }
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
                          {timeAgo(comment.createdAt)} {/* Display time ago */}
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

                    {/* Replies */}
                    {(showReplies[comment.id] || showAllReplies) &&
                      comment.replies?.length > 0 && (
                        <div className="mt-4 ml-6 space-y-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex space-x-3">
                              <img
                                src={
                                  reply.user?.avatar ||
                                  `https://source.unsplash.com/random/100x100?face=${reply.id}`
                                }
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
                                      {timeAgo(reply.createdAt)} {/* Display time ago */}
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
            ))
          : <p>no coments yet !</p>}

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

      {/* Comment Input */}
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
  );
};

export default CommentModal;