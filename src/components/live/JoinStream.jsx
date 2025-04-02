import React, { useState, useEffect, useRef } from 'react';
import AgoraRTC from 'agora-rtc-react';
import { appId, generateToken } from '../live-stream/AgoraConfig';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import axios from 'axios';
import ReactionSystem from './ReactionSystem';

const JoinStream = ({ streamId, channelName, setActiveStream }) => {
    const [joined, setJoined] = useState(false);
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
    const [activeViewMode, setActiveViewMode] = useState('grid');
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [viewersCount, setViewersCount] = useState(0);
    const mainVideoRef = useRef(null);

    // Initialize Agora client and join stream
    useEffect(() => {
        if (!channelName || !streamId) {
            toast.error("Invalid channel or stream ID");
            setActiveStream(null);
            return;
        }

        const agoraClient = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
        setClient(agoraClient); 

        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        // Simulate viewers count changes
        const viewerInterval = setInterval(() => {
            if (joined) {
                setViewersCount(prev => Math.min(prev + Math.floor(Math.random() * 3), 9999));
            }
        }, 5000);

        return () => {
            clearInterval(viewerInterval);
            if (localVideoTrack) localVideoTrack.close();
            if (localAudioTrack) localAudioTrack.close();
            if (client) client.leave();
            window.removeEventListener('resize', handleResize);
        };
    }, [channelName, streamId, joined]);

    // Join stream when client is initialized
    useEffect(() => {
        if (client && channelName && streamId && !joined) {
            handleJoin();
        }

        return () => {
            if (client && joined) {
                handleLeave();
            }
        };
    }, [client, channelName, streamId]);

    const joinStreamAPI = async (streamIdToJoin) => {
        try {
            const authToken = localStorage.getItem("authToken");
            if (!authToken) {
                throw new Error("Authentication token not found");
            }

            const response = await axios.post(
                `https://jaitok-api.jaitia.com/streaming/streams/${streamIdToJoin}/join`,
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
                toast.success("Joined stream successfully!");
                return true; // Success case returns true
            }
            throw new Error(response.data?.message || "Failed to join stream");
        } catch (err) {
            console.error("Error joining stream:", err);
            toast.error(err.response?.data?.message || "Failed to join stream");
            setActiveStream(null);
            return false; // Failure case returns false
        }
    };

    const handleLeaveStream = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            if (!authToken) throw new Error("Authentication token not found");
            if (!streamId) throw new Error("Stream ID not found");

            const response = await axios.post(
                `https://jaitok-api.jaitia.com/streaming/streams/${streamId}/leave`,
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
                toast.success("stream left successfully!!")
            }
            throw new Error(response.data?.message || "Failed to leave stream");
        } catch (err) {
            console.error("Error leaving stream:", err);
            toast.error(err.response?.data?.message || "Failed to leave stream");
            return false;
        }
    };

    const initializeTracks = async () => {
        try {
            const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            const videoTrack = await AgoraRTC.createCameraVideoTrack();
            setLocalAudioTrack(audioTrack);
            setLocalVideoTrack(videoTrack);
            return [audioTrack, videoTrack];
        } catch (error) {
            console.error("Error creating local tracks:", error);
            throw error;
        }
    };

    const handleJoin = async () => {
        if (!channelName || !streamId) {
            toast.error("Invalid Channel Name or Stream ID");
            return;
        }

        try {
            setIsLoading(true);

            // First call the API to join the stream
            const apiSuccess = await joinStreamAPI(streamId);
            if (!apiSuccess) return;

            // Set client role as audience
            await client.setClientRole("audience");

            // Generate token and join the Agora channel
            const token = generateToken(channelName);
            await client.join(appId, channelName, token || null, uuidv4());

            setViewersCount(Math.floor(Math.random() * 200));
            setJoined(true);

            // Setup event listeners for remote users
            client.on("user-published", async (user, mediaType) => {
                await client.subscribe(user, mediaType);

                if (mediaType === "video") {
                    setUsers((prevUsers) => {
                        if (!prevUsers.find(u => u.uid === user.uid)) {
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
            toast.error("Failed to join stream");
            setActiveStream(null);
        } finally {
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
            handleLeaveStream()
            await client.leave();
            setJoined(false);
            setUsers([]);
            setViewersCount(0);
            setMessages([]);
            setIsLoading(false);
            setActiveStream(null);
        } catch (error) {
            console.error("Error leaving channel:", error);
            setIsLoading(false);
        }
    };

    const toggleMute = async () => {
        if (localAudioTrack) {
            await localAudioTrack.setEnabled(!isMuted);
            setIsMuted(!isMuted);
            toast.info(!isMuted ? "Microphone muted" : "Microphone unmuted");
        }
    };

    const toggleVideo = async () => {
        if (localVideoTrack) {
            await localVideoTrack.setEnabled(!isVideoOff);
            setIsVideoOff(!isVideoOff);
            toast.info(!isVideoOff ? "Video turned off" : "Video turned on");
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            mainVideoRef.current?.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

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

            if (response.data?.success) {
                setMessages([...messages, message]);
                setNewMessage('');
            } else {
                throw new Error("Failed to post comment");
            }
        } catch (err) {
            console.error("Error posting comment:", err);
            toast.error("Failed to send message");
        }
    };

    const handleSendReaction = (reaction) => {
        // Handle reaction in parent component
        // console.log(`Sent ${reaction.name} reaction`);

        // Show toast notification or send to server
        toast.success(`Sent ${reaction.emoji} reaction!`, {
            autoClose: 1000,
            hideProgressBar: true,
            position: "bottom-right"
        });
    };

    const participantNames = {
        1: "Alex Chen",
        2: "Maya Johnson",
        3: "Raj Patel",
        4: "Sophia Garcia",
        5: "Noah Kim"
    };

    const getParticipantName = (uid) => {
        return participantNames[uid % 5 + 1] || `User ${uid.toString().substr(0, 4)}`;
    };

    if (!channelName || !streamId) {
        return (
            <div className="flex items-center justify-center h-screen bg-black">
                <div className="text-center p-6 bg-gray-900 rounded-lg max-w-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h2 className="text-xl font-semibold text-white mb-2">Invalid Stream</h2>
                    <p className="text-gray-400 mb-4">The stream you're trying to join is not available or the link is invalid.</p>
                    <button
                        onClick={() => setActiveStream(null)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                    >
                        Back to Streams
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-black w-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tiktok-pink mx-auto mb-4"></div>
                    <p className="text-white text-lg">{joined ? "Leaving stream..." : "Joining stream..."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen flex flex-col z-[5000] fixed inset-0 top-0 left-0">
            {/* Header */}
            <header className="bg-gray-900 py-3 px-4 shadow-md flex justify-between items-center">
                <div className="flex items-center">
                    <div className="h-8 w-8 bg-tiktok-pink rounded-md flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                                <span>{viewersCount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center">
                    <button
                        onClick={handleLeave}
                        className="h-10 px-4 bg-tiktok-pink hover:bg-tiktok-pink-dark text-white rounded-md font-medium transition-colors"
                        disabled={isLoading}
                    >
                        {isLoading ? "Leaving..." : "Leave Stream"}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className={`flex flex-1 overflow-y-auto h-[80vh] ${showChat ? 'flex-row' : 'flex-col'}`}>
                {/* Video Stream Container */}
                <div className={`${showChat ? 'w-3/4' : 'w-full'} h-full relative`} ref={mainVideoRef}>
                    {/* View Mode Selection */}
                    <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-50 rounded-lg p-1 flex">
                        <button
                            onClick={() => setActiveViewMode('grid')}
                            className={`p-2 rounded ${activeViewMode === 'grid' ? 'bg-tiktok-pink' : 'hover:bg-gray-800'}`}
                            title="Grid View"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setActiveViewMode('featured')}
                            className={`p-2 rounded ${activeViewMode === 'featured' ? 'bg-tiktok-pink' : 'hover:bg-gray-800'}`}
                            title="Featured View"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </button>
                    </div>

                    <div className="absolute bottom-20 right-6 z-[5000]">
                        <ReactionSystem onSendReaction={handleSendReaction} />
                    </div>
                    {/* Videos Container */}
                    {activeViewMode === 'grid' ? (
                        <div className={`grid grid-cols-1 gap-2 p-2 h-full`}>
                            {users.length > 0 ? (
                                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                                    <div id={`remote-video-${users[0].uid}`} className="w-full h-full object-cover"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                                        <div className="flex items-center">
                                            <div className="flex items-center justify-center h-8 w-8 bg-tiktok-pink rounded-full text-white text-sm font-medium mr-2">
                                                {getParticipantName(users[0].uid).charAt(0)}
                                            </div>
                                            <p className="text-white font-medium">{getParticipantName(users[0].uid)}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden flex flex-col items-center justify-center text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-center text-lg">Waiting for host to start streaming...</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col">
                            {/* Featured Video */}
                            <div className="flex-1 p-2">
                                <div className="relative h-full bg-gray-900 rounded-lg overflow-hidden">
                                    {users.length > 0 ? (
                                        <>
                                            <div id={`remote-video-${users[0].uid}`} className="w-full h-full"></div>
                                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                                                <div className="flex items-center">
                                                    <div className="flex items-center justify-center h-8 w-8 bg-tiktok-pink rounded-full text-white text-sm font-medium mr-2">
                                                        {getParticipantName(users[0].uid).charAt(0)}
                                                    </div>
                                                    <p className="text-white font-medium">{getParticipantName(users[0].uid)}</p>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-center text-xl">Waiting for host to start streaming...</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Thumbnail Row */}
                            <div className="h-24 px-2 pb-2">
                                <div className="flex h-full space-x-2 overflow-x-auto">
                                    {users.map((user, index) => (
                                        <div
                                            key={user.uid}
                                            className={`relative h-full aspect-video flex-shrink-0 bg-gray-900 rounded-lg overflow-hidden ${index === 0 && users.length > 0 ? 'border-2 border-tiktok-pink' : ''}`}
                                        >
                                            <div id={`remote-video-thumb-${user.uid}`} className="w-full h-full"></div>
                                            <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black to-transparent">
                                                <p className="text-white text-xs">{getParticipantName(user.uid)}</p>
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
                    <div className="w-1/4 bg-gray-900 border-l border-gray-800 flex flex-col h-[80vh]">
                        <div className="p-3 border-b border-gray-800 flex justify-between items-center">
                            <h2 className="text-white font-medium">Live Chat</h2>
                            <button
                                onClick={() => setShowChat(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-3">
                            {messages.length === 0 ? (
                                <div className="text-center text-gray-500 py-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <p className="text-sm">No messages yet. Be the first to chat!</p>
                                </div>
                            ) : (
                                messages.map(message => (
                                    <div key={message.id} className="flex items-start">
                                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-tiktok-pink text-white text-sm font-medium flex-shrink-0 mr-2">
                                            {message.sender.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-baseline">
                                                <span className="font-medium text-white mr-2">{message.sender}</span>
                                                <span className="text-xs text-gray-500">{message.timestamp}</span>
                                            </div>
                                            <p className="text-gray-300">{message.text}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-3 border-t border-gray-800">
                            <div className="flex">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-gray-800 text-white rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tiktok-pink"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="bg-tiktok-pink hover:bg-tiktok-pink-dark text-white px-4 py-2 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-tiktok-pink transition-colors"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-3 flex justify-center space-x-4">
                <button
                    onClick={toggleMute}
                    className="p-3 rounded-full bg-gray-800 hover:bg-opacity-80 transition-colors"
                    title={isMuted ? "Unmute" : "Mute"}
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
                                clipRule="evenodd"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                                clipRule="evenodd"
                            />
                        )}
                        {isMuted && (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                            />
                        )}
                    </svg>
                </button>
                <button
                    onClick={toggleVideo}
                    className="p-3 rounded-full bg-gray-800 hover:bg-opacity-80 transition-colors"
                    title={isVideoOff ? "Turn on video" : "Turn off video"}
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
                </button>
                <button
                    onClick={toggleFullscreen}
                    className="p-3 rounded-full bg-gray-800 hover:bg-opacity-80 transition-colors"
                    title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
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
                    className="p-3 rounded-full bg-gray-800 hover:bg-opacity-80 transition-colors"
                    title={showChat ? 'Hide Chat' : 'Show Chat'}
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
};

export default JoinStream;