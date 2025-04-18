import React, { useState, useRef, useEffect } from 'react';
import { Heart, Bookmark, Share2, MessageCircle, X, Plus, User } from 'lucide-react';
import { FaHeart } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import CommentModal from './CommentModal';
import ShareModal from './ShareModal';
import { useNavigate } from 'react-router-dom';

const VideoCard = ({ video }) => {
  const [likes, setLikes] = useState(video.totalLikes || 0);
  const [liked, setLiked] = useState(video.isLiked);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [commentsCount, setCommentsCount] = useState(video.totalComments || 0);
  const [isFollowing, setIsFollowing] = useState(video.isFollow);

  const userId = localStorage.getItem("userId");

  const navigate = useNavigate();

  const videoRef = useRef(null);

  const videoSrc =
    video.videoUrl?.startsWith("https")
      ? video.videoUrl
      : `https://jaitok-api.jaitia.com${video.videoUrl}`;

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

  const toggleLike = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        toast.error("Please log in to like videos.");
        return;
      }

      const url = `https://jaitok-api.jaitia.com/interactions/interactions/videos/${video.id}/${liked ? 'unlike' : 'like'}`;

      const response = await axios.post(
        url,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            "access-token": authToken,
          },
        }
      );

      if (response.data && response.data.success) {
        setLiked(!liked);
        setLikes(prev => liked ? prev - 1 : prev + 1);
        toast.success(liked ? 'Video unliked' : 'Video liked');
      } else {
        toast.error("Failed to update like status");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error("Failed to update like status");
    }
  };

  const toggleFollow = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        toast.error("Please log in to follow users.");
        return;
      }

      const url = `https://jaitok-api.jaitia.com/interactions/follows/${isFollowing ? 'unfollow' : 'follow'}/${video.user.id}`;

      const response = await axios.post(
        url,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
            "access-token": authToken,
          },
        }
      );

      if (response.data && response.data.success) {
        setIsFollowing(!isFollowing);
        toast.success(isFollowing ? "Unfollowed successfully" : "Followed successfully");
      } else {
        toast.error("Failed to update follow status");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error("Failed to update follow status");
    }
  };

  return (
    <div className="relative w-full max-w-[420px] mx-auto mb-5 snap-start">
      <div className="relative h-[82vh] bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
          controls
          crossOrigin="anonymous"
          preload="auto"
          onError={(e) => {
            console.error("Video failed to load", e);
          }}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="absolute right-3 bottom-[330px] flex flex-col items-center gap-2">
        <div className="relative">
          <img
            src={video.user?.avatar ? video.user?.avatar : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbBa24AAg4zVSuUsL4hJnMC9s3DguLgeQmZA&s"}
            alt={`${video.user.firstName} ${video.user.lastName}`}
            className="w-10 h-10 rounded-full"
            onClick={() => navigate(`/user/${video.user.id}`)}
          />
          {userId !== video.user.id && (
            <button
              onClick={toggleFollow}
              className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center ${isFollowing ? 'bg-red-500' : 'bg-green-500'}`}
            >
              {isFollowing ? (
                <X size={14} className="text-white" />
              ) : (
                <Plus size={14} className="text-white" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="absolute right-4 bottom-16 flex flex-col items-center gap-4">
        <button className="flex flex-col items-center" onClick={toggleLike}>
          {liked ? (
            <FaHeart size={28} className="text-red-500 scale-110" />
          ) : (
            <Heart size={28} className="text-white" />
          )}
          <span className="text-white text-xs mt-1">{likes}</span>
        </button>
        <button
          className="flex flex-col items-center"
          onClick={() => setIsCommentModalOpen(true)}
        >
          <MessageCircle size={28} className="text-white" />
          <span className="text-white text-xs mt-1">{commentsCount}</span>
        </button>
        <button className="flex flex-col items-center">
          <Bookmark size={28} className="text-white" />
          <span className="text-white text-xs mt-1">{video.totalSaves || 0}</span>
        </button>
        <button className="flex flex-col items-center" onClick={() => setIsShareModalOpen(true)}>
          <Share2 size={28} className="text-white" />
          <span className="text-white text-xs mt-1">{video.totalShares || 0}</span>
        </button>
      </div>

      <div className="absolute bottom-16 left-4 right-16 text-white">
        <p className="font-bold">@{video.user?.firstName || "user"} {video.user?.lastName || ""}</p>
        <p className="text-sm mt-1">{video.title}</p>
        {video.description && <p className="text-sm mt-1 text-gray-300">{video.description}</p>}
      </div>

      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        video={video}
        onCommentPosted={() => setCommentsCount((prev) => prev + 1)}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        video={video}
      />
    </div>
  );
};

export default VideoCard;