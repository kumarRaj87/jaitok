import React, { useState, useEffect, useRef } from 'react';
import AgoraRTC from 'agora-rtc-react';
import { appId, generateToken } from '../AgoraConfig';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import axios from 'axios';
import JoinView from './JoinView';
import StreamView from './StreamView';

const LiveStream = () => {
  // State management
  const [isHost, setIsHost] = useState(true);
  const [joined, setJoined] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [users, setUsers] = useState([]);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [client, setClient] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamId, setStreamId] = useState(null);
  const [activeViewMode, setActiveViewMode] = useState('grid');
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [viewersCount, setViewersCount] = useState(0);
  const mainVideoRef = useRef(null);

  const [streamsData, setStreamsData] = useState({
    allStreams: [],
    streamIds: [],
    channelNames: [],
    loadingStreams: false,
    error: null
  });

  // Fetch streams data
  const fetchStreamsData = async () => {
    try {
      setStreamsData(prev => ({ ...prev, loadingStreams: true, error: null }));
      const authToken = localStorage.getItem("authToken");

      const response = await axios.get('https://jaitok-api.jaitia.com/query/stream', {
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'access-token': authToken,
        },
      });

      const streams = response.data?.data?.stream || [];
      const streamIds = streams.map(stream => stream.Id);
      const channelNames = streams.map(stream => stream.channelname);

      setStreamsData({
        allStreams: streams,
        streamIds,
        channelNames,
        loadingStreams: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching Streams list:', error);
      setStreamsData(prev => ({
        ...prev,
        loadingStreams: false,
        error: error.message
      }));
    }
  };

  useEffect(() => {
    fetchStreamsData();
  }, []);

  useEffect(() => {
    const agoraClient = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
    setClient(agoraClient);

    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    if (joined) {
      const interval = setInterval(() => {
        setViewersCount(prev => Math.min(prev + Math.floor(Math.random() * 3), 9999));
      }, 5000);
      return () => {
        clearInterval(interval);
        window.removeEventListener('resize', handleResize);
      };
    }

    return () => {
      if (localVideoTrack) localVideoTrack.close();
      if (localAudioTrack) localAudioTrack.close();
      if (client) client.leave();
      window.removeEventListener('resize', handleResize);
    };
  }, [joined]);

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
      if (!authToken) throw new Error("Authentication token not found");
      if (!streamId) throw new Error("Stream ID not found");

      const response = await axios.post(
        `https://jaitok-api.jaitia.com/streaming/streams/${streamId}/end`,
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
    if (!channelName) return;

    try {
      setIsLoading(true);
      await client.setClientRole(isHost ? "host" : "audience");
      const token = generateToken(channelName);
      await client.join(appId, channelName, token || null, uuidv4());

      if (isHost) {
        
        const [audioTrack, videoTrack] = await initializeTracks();
        await client.publish([audioTrack, videoTrack]);
        videoTrack.play('local-video');
        await handleStartStream();
      }

      setViewersCount(Math.floor(Math.random() * 200));
      setJoined(true);
      setIsLoading(false);

      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);

        if (mediaType === "video") {
          setUsers((prevUsers) => {
            if (!prevUsers.find(u => u.uid === user.uid)) {
              return [...prevUsers, user];
            }
            return prevUsers;
          });
          setTimeout(() => user.videoTrack?.play(`remote-video-${user.uid}`), 500);
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
      if (localAudioTrack) localAudioTrack.close();
      if (localVideoTrack) localVideoTrack.close();
      if (isHost) handleEndStream();
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
      mainVideoRef.current.requestFullscreen().catch(err => {
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
        sender: 'You',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
          setNewMessage('');
        } else {
          throw new Error("Failed to post comment");
        }
      } catch (err) {
        toast.error("Error failed to comment:", err);
        console.error("Error failed to comment:", err);
      }
    }
  };

  const getParticipantName = (uid) => {
    const participantNames = {
      1: "Alex Chen",
      2: "Maya Johnson",
      3: "Raj Patel",
      4: "Sophia Garcia",
      5: "Noah Kim"
    };
    return participantNames[uid % 5 + 1] || `User ${uid.toString().substr(0, 4)}`;
  };

  return joined ? (
    <StreamView
      channelName={channelName}
      isHost={isHost}
      viewersCount={viewersCount}
      users={users}
      showChat={showChat}
      setShowChat={setShowChat}
      messages={messages}
      newMessage={newMessage}
      setNewMessage={setNewMessage}
      handleSendMessage={handleSendMessage}
      handleLeave={handleLeave}
      isMuted={isMuted}
      isVideoOff={isVideoOff}
      isFullscreen={isFullscreen}
      toggleMute={toggleMute}
      toggleVideo={toggleVideo}
      toggleFullscreen={toggleFullscreen}
      mainVideoRef={mainVideoRef}
      activeViewMode={activeViewMode}
      setActiveViewMode={setActiveViewMode}
      getParticipantName={getParticipantName}
    />
  ) : (
    <JoinView
      channelName={channelName}
      setChannelName={setChannelName}
      isHost={isHost}
      setIsHost={setIsHost}
      handleJoin={handleJoin}
      isLoading={isLoading}
    />
  );
};

export default LiveStream;