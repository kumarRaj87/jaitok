import React, { useState } from 'react';
import { X, Facebook, Twitter, Mail, Share2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const VideoShareModal = ({ isOpen, onClose, video, onShareSuccess }) => {
  const [isSharing, setIsSharing] = useState(false);
  const authToken = localStorage.getItem("authToken");

  if (!isOpen) return null;

  const shareToSocial = async (platform) => {
    setIsSharing(true);
    try {
      const response = await axios.post(
        `https://jaitok-api.jaitia.com/interactions/interactions/videos/${video.id}/share`,
        { platform },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'access-token': authToken
          }
        }
      );

      if (response.data.success) {
        toast.success("Video shared successfully!");
        if (onShareSuccess) {
          onShareSuccess();
        }

        // Handle platform-specific sharing
        const shareUrl = video.videoUrl;
        const shareText = `Check out this video: ${video.title}`;

        switch (platform) {
          case 'facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
            break;
          case 'twitter':
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
            break;
          case 'whatsapp':
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
            break;
          case 'email':
            window.location.href = `mailto:?subject=${encodeURIComponent('Check out this video')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
            break;
        }

        onClose();
      }
    } catch (err) {
      console.error('Error sharing video:', err);
      toast.error(err.response?.data?.message || 'Failed to share video. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Share Video</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition"
          >
            <X className="text-gray-500" size={20} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <button
            onClick={() => shareToSocial('facebook')}
            disabled={isSharing}
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-blue-50 transition"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Facebook className="text-white" size={24} />
            </div>
            <span className="text-sm text-gray-600">Facebook</span>
          </button>

          <button
            onClick={() => shareToSocial('twitter')}
            disabled={isSharing}
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-blue-50 transition"
          >
            <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center">
              <Twitter className="text-white" size={24} />
            </div>
            <span className="text-sm text-gray-600">Twitter</span>
          </button>

          <button
            onClick={() => shareToSocial('whatsapp')}
            disabled={isSharing}
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-green-50 transition"
          >
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <Share2 className="text-white" size={24} />
            </div>
            <span className="text-sm text-gray-600">WhatsApp</span>
          </button>

          <button
            onClick={() => shareToSocial('email')}
            disabled={isSharing}
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center">
              <Mail className="text-white" size={24} />
            </div>
            <span className="text-sm text-gray-600">Email</span>
          </button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Video URL</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={video.videoUrl}
              readOnly
              className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(video.videoUrl);
                toast.success('URL copied to clipboard!');
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoShareModal;