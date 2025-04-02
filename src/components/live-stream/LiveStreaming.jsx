import React, { useState, useEffect, useRef } from "react";
import AgoraRTC from "agora-rtc-react";
import { appId, generateToken } from "./AgoraConfig";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import axios from "axios";

const LiveStream = () => {
  const [isHost, setIsHost] = useState(false);
  const [joined, setJoined] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [users, setUsers] = useState([]);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [client, setClient] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamId, setStreamId] = useState(null);
  const [activeViewMode, setActiveViewMode] = useState("grid");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [AllStreams, setAllStreams] = useState([]);
  const mainVideoRef = useRef(null);

  const [streamsData, setStreamsData] = useState({
    allStreams: [],
    streamIds: [],
    channelNames: [],
    loadingStreams: false,
    error: null,
  });

  // Replace your existing fetchStreams function with this enhanced version
  const fetchStreamsData = async () => {
    try {
      setStreamsData((prev) => ({
        ...prev,
        loadingStreams: true,
        error: null,
      }));
      const authToken = localStorage.getItem("authToken");

      const response = await axios.get(
        "https://jaitok-api.jaitia.com/query/stream",
        {
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            "access-token": authToken,
          },
        }
      );

      // Extract the streams array from response
      const streams = response.data?.data?.stream || [];

      // Extract IDs and channel names
      const streamIds = streams.map((stream) => stream.Id);
      const channelNames = streams.map((stream) => stream.channelname);
      console.log("Streams Data:", streamIds);
      console.log("Channel Names:", channelNames);

      setStreamsData({
        allStreams: streams,
        streamIds,
        channelNames,
        loadingStreams: false,
        error: null,
      });

      setAllStreams(streams);
    } catch (error) {
      console.error("Error fetching Streams list:", error);
      setStreamsData((prev) => ({
        ...prev,
        loadingStreams: false,
        error: error.message,
      }));
    }
  };

  // Add this useEffect to call fetchStreams when component mounts
  useEffect(() => {
    fetchStreamsData();
  }, []);

  // *********************
  // Add sample viewers count for UI demonstration
  const [viewersCount, setViewersCount] = useState(0);

  useEffect(() => {
    // Initialize Agora client
    const agoraClient = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
    setClient(agoraClient);

    // Window resize listener
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    // Simulate viewers for demo purposes
    if (joined) {
      const interval = setInterval(() => {
        setViewersCount((prev) =>
          Math.min(prev + Math.floor(Math.random() * 3), 9999)
        );
      }, 5000);
      return () => {
        clearInterval(interval);
        window.removeEventListener("resize", handleResize);
      };
    }

    return () => {
      if (localVideoTrack) {
        localVideoTrack.close();
      }
      if (localAudioTrack) {
        localAudioTrack.close();
      }
      if (client) {
        client.leave();
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [joined]);

  const fetchStreams = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(
        "https://jaitok-api.jaitia.com/query/stream",
        {
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            "access-token": authToken,
          },
        }
      );
      setAllStreams(response.data.data.streams);
    } catch (error) {
      console.error("Error fetching Streams list:", error);
    }
  };

  useEffect(() => {
    fetchStreams();
  }, []);

  const handleStartStream = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.post(
        "https://jaitok-api.jaitia.com/streaming/streams/start",
        { title: channelName },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            "access-token": authToken,
          },
        }
      );

      if (response.data && response.data.success) {
        toast.success("Stream Started!");
        setStreamId(response.data.data.stream.id);
      } else {
        throw new Error("Failed to fetch videos");
      }
    } catch (err) {
      toast.error("Error failed to start stream:", err);
      console.error("Error failed to start stream:", err);
    }
  };

  const handleEndStream = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        throw new Error("Authentication token not found");
      }
      if (!streamId) {
        throw new Error("Stream ID not found");
      }

      const response = await axios.post(
        `https://jaitok-api.jaitia.com/streaming/streams/${streamId}/end`,
        {}, // Empty body
        {
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            "access-token": authToken,
          },
        }
      );

      if (response.data && response.data.success) {
        toast.success("Stream ended successfully!");
        setStreamId(null);
        return true;
      } else {
        throw new Error(response.data?.message || "Failed to end stream");
      }
    } catch (err) {
      console.error("Error ending stream:", err);
      toast.error(err.response?.data?.message || "Failed to end stream");
      return false;
    }
  };

  const initializeTracks = async () => {
    try {
      setIsLoading(true);
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);
      setIsLoading(false);
      return [audioTrack, videoTrack];
    } catch (error) {
      console.error("Error creating local tracks:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const handleJoin = async () => {
    if (!channelName) {
      // Use a more elegant notification instead of alert
      return;
    }

    try {
      setIsLoading(true);
      // Set client role based on isHost
      await client.setClientRole(isHost ? "host" : "audience");

      // Generate token (in production, this should be done on your server)
      const token = generateToken(channelName);

      // Join the channel
      await client.join(appId, channelName, token || null, uuidv4());

      if (isHost) {
        // Initialize and publish tracks if user is host
        const [audioTrack, videoTrack] = await initializeTracks();
        await client.publish([audioTrack, videoTrack]);

        // Display local video
        videoTrack.play("local-video");
        await handleStartStream();
      }

      setViewersCount(Math.floor(Math.random() * 200));

      setJoined(true);
      setIsLoading(false);

      // Listen for remote users
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);

        if (mediaType === "video") {
          setUsers((prevUsers) => {
            if (!prevUsers.find((u) => u.uid === user.uid)) {
              return [...prevUsers, user];
            }
            return prevUsers;
          });
          setTimeout(() => {
            user.videoTrack?.play(`remote-video-${user.uid}`);
          }, 500);
        }
        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      });

      client.on("user-unpublished", (user) => {
        setUsers((prevUsers) => prevUsers.filter((u) => u.uid !== user.uid));
      });
    } catch (error) {
      console.error("Error joining channel:", error);
      setIsLoading(false);
    }
  };

  const handleLeave = async () => {
    try {
      setIsLoading(true);
      if (localAudioTrack) {
        localAudioTrack.close();
      }
      if (localVideoTrack) {
        localVideoTrack.close();
      }
      if (isHost) {
        handleEndStream();
      }
      await client.leave();
      setJoined(false);
      setUsers([]);
      setViewersCount(0);
      setMessages([]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error leaving channel:", error);
      setIsLoading(false);
    }
  };

  const toggleMute = async () => {
    if (localAudioTrack) {
      localAudioTrack.setEnabled(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = async () => {
    if (localVideoTrack) {
      localVideoTrack.setEnabled(!isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mainVideoRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: "You",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.post(
          `https://jaitok-api.jaitia.com/streaming/streams/${streamId}/comments`,
          { message: newMessage },
          {
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
              "access-token": authToken,
            },
          }
        );

        if (response.data && response.data.success) {
          toast.success("Commented Successfully!");
          setMessages([...messages, message]);
          setNewMessage("");
        } else {
          throw new Error("Failed to post comment");
        }
      } catch (err) {
        toast.error("Error failed to comment:", err);
        console.error("Error failed to comment:", err);
      }
    }
  };

  // Sample participant names for demonstration
  const participantNames = {
    1: "Alex Chen",
    2: "Maya Johnson",
    3: "Raj Patel",
    4: "Sophia Garcia",
    5: "Noah Kim",
  };

  // Get participant name or default to UID
  const getParticipantName = (uid) => {
    return (
      participantNames[(uid % 5) + 1] || `User ${uid.toString().substr(0, 4)}`
    );
  };

  const renderJoinView = () => (
    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 min-h-screen flex items-center justify-center p-4 z-[500]">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white border-opacity-20">
        <h1 className="text-3xl font-bold mb-6 text-white text-center">
          Join Livestream
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Channel Name
            </label>
            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-300"
              placeholder="Enter channel name"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isHost}
                  onChange={(e) => setIsHost(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`block w-14 h-8 rounded-full transition-colors duration-200 ease-in-out ${
                    isHost ? "bg-purple-600" : "bg-gray-600"
                  }`}
                ></div>
                <div
                  className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out ${
                    isHost ? "transform translate-x-6" : ""
                  }`}
                ></div>
              </div>
              <span className="ml-3 text-white">Join as Host</span>
            </label>
          </div>

          <button
            onClick={handleJoin}
            disabled={isLoading}
            className={`w-full py-3 px-6 text-white font-medium rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 
              ${
                isLoading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Connecting...
              </span>
            ) : (
              `Join ${isHost ? "as Host" : "Stream"}`
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderStreamView = () => (
    <div className="bg-gray-900 min-h-screen flex flex-col z-[500]">
      {/* Header */}
      <header className="bg-gray-800 py-3 px-4 shadow-md flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-purple-600 rounded-md flex items-center justify-center mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">{channelName}</h1>
            <div className="flex items-center text-sm text-gray-400">
              <div className="flex items-center">
                <span className="h-2 w-2 bg-red-500 rounded-full mr-1"></span>
                <span className="mr-2">LIVE</span>
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{viewersCount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          {isHost && (
            <button className="flex items-center justify-center h-10 px-4 mr-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
              Streaming
            </button>
          )}

          <button
            onClick={handleLeave}
            className="h-10 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-md font-medium transition-colors"
          >
            Leave
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className={`flex flex-1 ${showChat ? "flex-row" : "flex-col"}`}>
        {/* Video Stream Container */}
        <div
          className={`${showChat ? "w-3/4" : "w-full"} h-full relative`}
          ref={mainVideoRef}
        >
          {/* View Mode Selection */}
          <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-50 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveViewMode("grid")}
              className={`p-2 rounded ${
                activeViewMode === "grid"
                  ? "bg-purple-600"
                  : "hover:bg-gray-700"
              }`}
              title="Grid View"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setActiveViewMode("featured")}
              className={`p-2 rounded ${
                activeViewMode === "featured"
                  ? "bg-purple-600"
                  : "hover:bg-gray-700"
              }`}
              title="Featured View"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </button>
          </div>

          {/* Videos Container */}
          {activeViewMode === "grid" ? (
            <div
              className={`grid ${
                users.length === 0
                  ? "grid-cols-1"
                  : users.length === 1
                  ? "grid-cols-1 md:grid-cols-2"
                  : users.length <= 3
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              } gap-2 p-2 h-full`}
            >
              {/* Local Video for Host */}
              {isHost && (
                <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
                  <div id="local-video" className="w-full h-full"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center h-8 w-8 bg-purple-600 rounded-full text-white text-sm font-medium mr-2">
                        {isHost ? "H" : "Y"}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          You {isHost ? "(Host)" : ""}
                        </p>
                      </div>
                      {isVideoOff && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Remote Videos */}
              {users.map((user) => (
                <div
                  key={user.uid}
                  className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden"
                >
                  <div
                    id={`remote-video-${user.uid}`}
                    className="w-full h-full"
                  ></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center h-8 w-8 bg-indigo-600 rounded-full text-white text-sm font-medium mr-2">
                        {getParticipantName(user.uid).charAt(0)}
                      </div>
                      <p className="text-white font-medium">
                        {getParticipantName(user.uid)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Placeholder for empty spots */}
              {users.length === 0 && !isHost && (
                <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden flex flex-col items-center justify-center text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-center text-lg">
                    Waiting for host to start streaming...
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Featured Video */}
              <div className="flex-1 p-2">
                <div className="relative h-full bg-gray-800 rounded-lg overflow-hidden">
                  {/* Show either the first remote user or the local video as featured */}
                  {users.length > 0 ? (
                    <>
                      <div
                        id={`remote-video-${users[0].uid}`}
                        className="w-full h-full"
                      ></div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center h-8 w-8 bg-indigo-600 rounded-full text-white text-sm font-medium mr-2">
                            {getParticipantName(users[0].uid).charAt(0)}
                          </div>
                          <p className="text-white font-medium">
                            {getParticipantName(users[0].uid)}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : isHost ? (
                    <>
                      <div id="local-video" className="w-full h-full"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center h-8 w-8 bg-purple-600 rounded-full text-white text-sm font-medium mr-2">
                            {isHost ? "H" : "Y"}
                          </div>
                          <p className="text-white font-medium">
                            You {isHost ? "(Host)" : ""}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-center text-xl">
                        Waiting for host to start streaming...
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Row */}
              <div className="h-24 px-2 pb-2">
                <div className="flex h-full space-x-2 overflow-x-auto">
                  {/* Show all participants as thumbnails */}
                  {isHost && (
                    <div className="relative h-full aspect-video flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden border-2 border-purple-600">
                      <div
                        id="local-video-thumb"
                        className="w-full h-full"
                      ></div>
                      <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black to-transparent">
                        <p className="text-white text-xs">You (Host)</p>
                      </div>
                    </div>
                  )}

                  {users.map((user, index) => (
                    <div
                      key={user.uid}
                      className={`relative h-full aspect-video flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden ${
                        index === 0 && users.length > 0
                          ? "border-2 border-purple-600"
                          : ""
                      }`}
                    >
                      <div
                        id={`remote-video-thumb-${user.uid}`}
                        className="w-full h-full"
                      ></div>
                      <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black to-transparent">
                        <p className="text-white text-xs">
                          {getParticipantName(user.uid)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="w-1/4 bg-gray-800 border-l border-gray-700 flex flex-col h-[80vh]">
            <div className="p-3 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-white font-medium">Live Chat</h2>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="text-sm">
                    No messages yet. Be the first to chat!
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="flex items-start">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white text-sm font-medium flex-shrink-0 mr-2">
                      {message.sender.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline">
                        <span className="font-medium text-white mr-2">
                          {message.sender}
                        </span>
                        <span className="text-xs text-gray-500">
                          {message.timestamp}
                        </span>
                      </div>
                      <p className="text-gray-300">{message.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-gray-700">
              <div className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 text-white rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-3 flex justify-center space-x-4">
        {isHost && (
          <>
            {/* <button
              onClick={toggleMute}
              className={`p-3 rounded-full ${isMuted ? 'bg-red-600' : 'bg-gray-700'
                } hover:bg-opacity-80 transition-colors`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMuted ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                )}
              </svg>
            </button>
            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full ${isVideoOff ? 'bg-red-600' : 'bg-gray-700'
                } hover:bg-opacity-80 transition-colors`}
              title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isVideoOff ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                )}
              </svg>
            </button> */}

            <button
              onClick={toggleMute}
              className={`p-3 rounded-full ${
                isMuted ? "bg-red-600" : "bg-gray-700"
              } hover:bg-opacity-80 transition-colors`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <MicOff className="h-6 w-6 text-white" />
              ) : (
                <Mic className="h-6 w-6 text-white" />
              )}
            </button>
            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full ${
                isVideoOff ? "bg-red-600" : "bg-gray-700"
              } hover:bg-opacity-80 transition-colors`}
              title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
            >
              {isVideoOff ? (
                <VideoOff className="h-6 w-6 text-white" />
              ) : (
                <Video className="h-6 w-6 text-white" />
              )}
            </button>
          </>
        )}
        <button
          onClick={toggleFullscreen}
          className="p-3 rounded-full bg-gray-700 hover:bg-opacity-80 transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isFullscreen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            )}
          </svg>
        </button>
        <button
          onClick={() => setShowChat(!showChat)}
          className="p-3 rounded-full bg-gray-700 hover:bg-opacity-80 transition-colors"
          title={showChat ? "Hide Chat" : "Show Chat"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      </div>
    </div>
  );

  return joined ? renderStreamView() : renderJoinView();
};

export default LiveStream;
