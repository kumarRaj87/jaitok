import React from 'react';
import { FaFacebook, FaTwitter, FaWhatsapp, FaEnvelope, FaLine, FaPrint, FaTimes } from 'react-icons/fa';

const ShareModal = ({ isOpen, onClose, video }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        {/* Close button (cross icon) */}
        <button
          className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full"
          onClick={onClose}
        >
          <FaTimes className="text-gray-600" size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4  ml-0">Share to</h2>
        <div className="grid grid-cols-3 gap-4">
          <button className="flex flex-col items-center">
            <FaFacebook className="text-blue-600" size={24} />
            <span className="text-sm mt-1">Facebook</span>
          </button>
          <button className="flex flex-col items-center">
            <FaTwitter className="text-blue-400" size={24} />
            <span className="text-sm mt-1">X</span>
          </button>
          <button className="flex flex-col items-center">
            <FaWhatsapp className="text-green-500" size={24} />
            <span className="text-sm mt-1">WhatsApp</span>
          </button>
          <button className="flex flex-col items-center">
            <FaEnvelope className="text-gray-600" size={24} />
            <span className="text-sm mt-1">Email</span>
          </button>
          <button className="flex flex-col items-center">
            <FaLine className="text-green-400" size={24} />
            <span className="text-sm mt-1">Line</span>
          </button>
          <button className="flex flex-col items-center">
            <FaPrint className="text-gray-700" size={24} />
            <span className="text-sm mt-1">Printers</span>
          </button>
        </div>
        <div className="mt-4">
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={`http://167.86.121.152${video.videoUrl}`}
            readOnly
          />
        </div>
      
      </div>
    </div>
  );
};

export default ShareModal;