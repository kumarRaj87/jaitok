import React, { useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import axios from "axios";

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://jaitok-api.jaitia.com/query/videos",
          {
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
              "access-token": authToken,
            },
          }
        );

        if (response.data && response.data.success) {
          setVideos(response.data.data);
        } else {
          throw new Error("Failed to fetch videos");
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <p className="text-center text-red-500 p-4 bg-red-100 rounded-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-[50vh] overflow-y-scroll snap-y snap-mandatory w-full my-3">
      {Array.isArray(videos) && videos.length > 0 ? (
        videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))
      ) : (
        <div className="flex items-center justify-center h-screen">
          <p className="text-center text-gray-500">No videos available</p>
        </div>
      )}
    </div>
  );
};

export default VideoFeed;