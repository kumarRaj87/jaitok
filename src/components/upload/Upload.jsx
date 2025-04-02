import { useState, useRef, useEffect } from 'react';
import { BsUpload } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai';
import { FaFileVideo } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import axios from 'axios';

const Upload = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState('public');
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024 * 1024;
  const MAX_DURATION = 60 * 60 * 1000;

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFiles(files[0]);
    }
  };

  const handleFiles = (file) => {
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a valid video file.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds the maximum limit of 10 GB.');
      return;
    }

    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      if (video.duration * 1000 > MAX_DURATION) {
        toast.error('Video duration exceeds the maximum limit of 60 minutes.');
        return;
      }

      setSelectedVideo({ file, url: URL.createObjectURL(file) });
    };
  };

  const removeVideo = () => {
    setSelectedVideo(null);
    setVideoTitle('');
    setVideoDescription('');
    setVisibility('public');
  };


  const uploadVideo = async () => {
    if (loading) return;

    if (!selectedVideo) {
      toast.error('Please select a video first.');
      return;
    }

    if (!videoTitle.trim()) {
      toast.error('Please enter a video title.');
      return;
    }

    const formData = new FormData();
    formData.append('video', selectedVideo.file);
    formData.append('title', videoTitle);
    formData.append('description', videoDescription);
    formData.append('visibility', visibility);
    formData.append('allowDuet', 'true');
    formData.append('allowStitch', 'true');
    formData.append('allowComments', 'true');

    setLoading(true);

    try {
      const authToken = localStorage.getItem('authToken');
      if (!selectedVideo.file || !videoTitle || !videoDescription || !visibility) {
        toast.error('fileds cant be empty!');
        return;
      }
      const response = await axios.post(
        'https://jaitok-api.jaitia.com/interactions/videos/',
        formData,
        {
          headers: {
            'access-token': authToken,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {

        toast.success('Video uploaded successfully!');
        setSelectedVideo(null);
        setVideoTitle('');
        setVideoDescription('');
        setVisibility('public');
      }
    } catch (error) {
      console.error('Upload Error:', error);
      toast.error('Upload Error:', error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (selectedVideo?.url) {
        URL.revokeObjectURL(selectedVideo.url);
      }
    };
  }, [selectedVideo]);

  return (
    <div className="p-2 sm:p-4 lg:p-8 lg:pl-72">
      <div className="relative lg:justify-center lg:flex lg:flex-col lg:items-center bg-gray-50 border-gray-100 border-[1px] rounded-lg lg:p-16 lg:w-full p-4 sm:p-6 md:p-10 text-center transition-all">

        {!selectedVideo ? (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <BsUpload size={24} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold">Select video to upload</h2>
              <p className="text-gray-500">Or drag and drop it here</p>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#FE2C55] text-white px-6 py-2 rounded-full hover:bg-[#ef2347]"
              >
                Select video
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-5 lg:flex-row w-full lg:w-full xl:w-[80%] lg:justify-center lg:items-center lg:flex">
            <div className="relative border rounded-lg overflow-hidden shadow-sm w-full mx-auto">
              <video src={selectedVideo.url} className="w-full h-64 lg:h-72 object-cover" controls />
              <div className="p-4 flex justify-between items-center bg-white">
                <FaFileVideo size={24} className="text-gray-600" />
                <p className="text-sm truncate flex-1 ml-2">{selectedVideo.file.name}</p>
                <button
                  onClick={removeVideo}
                  className="text-red-500 hover:text-red-700"
                >
                  <AiOutlineClose size={20} />
                </button>
              </div>
            </div>

            <div className="max-w-md mx-auto space-y-4 ">
              <input
                type="text"
                placeholder="Enter video title"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE2C55] focus:border-transparent"
              />

              {/* Enlarged Description Input */}
              <textarea
                placeholder="Enter a detailed video description"
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE2C55] focus:border-transparent resize-none h-48"
              />

              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE2C55] focus:border-transparent"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="followers">Followers</option>
              </select>

              <button
                onClick={uploadVideo}
                disabled={loading}
                className="w-full bg-[#FE2C55] text-white px-6 py-3 rounded-lg hover:bg-[#ef2347] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Uploading...' : 'Upload Video'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Additional Information Grid */}
      <div className="lg:mt-12 sm:mt-8 mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 sm:p-6 lg:gap-8 w-full">
        {[
          {
            title: 'Size and duration',
            description: 'Maximum size: 10 GB, video duration: 60 minutes.',
          },
          {
            title: 'File formats',
            description: "Recommended: 'mp4'. Other major formats are supported.",
          },
          {
            title: 'Video resolutions',
            description: 'High-resolution recommended: 1080p, 1440p, 4K.',
          },
          {
            title: 'Aspect ratios',
            description: 'Recommended: 16:9 for landscape, 9:16 for vertical.',
          },
        ].map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center space-x-2">
              <BsUpload size={20} />
              <h3 className="font-medium">{item.title}</h3>
            </div>
            <p className="text-sm text-gray-500">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Upload;
