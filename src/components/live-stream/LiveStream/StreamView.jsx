import React, { useEffect, useRef } from 'react';
import ChatPanel from './ChatPanel';
import StreamControls from './StreamControls';

const StreamView = ({
  channelName,
  isHost,
  viewersCount,
  users,
  showChat,
  setShowChat,
  messages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleLeave,
  isMuted,
  isVideoOff,
  isFullscreen,
  toggleMute,
  toggleVideo,
  toggleFullscreen,
  mainVideoRef,
  activeViewMode,
  setActiveViewMode,
  getParticipantName,
  localVideoTrack
}) => {
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    if (isHost && localVideoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          localStreamRef.current = stream;
          localVideoRef.current.srcObject = stream;
        })
        .catch(error => {
          console.error('Error accessing media devices:', error);
        });
    }

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isHost]);

  const handleToggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    toggleMute();
  };

  const handleToggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    toggleVideo();
  };

  const renderVideoGrid = () => (
    <div className={`grid grid-cols-1 gap-2 p-2 h-full`}>
      {isHost ? (
        <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted={isMuted}
            className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : 'block'}`}
          />
          {isVideoOff && (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-400 mt-2">Camera is off</p>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-8 w-8 bg-indigo-600 rounded-full text-white text-sm font-medium mr-2">
                {getParticipantName('host').charAt(0)}
              </div>
              <p className="text-white font-medium">You (Host)</p>
              {isMuted && (
                <div className="ml-2 p-1 bg-black bg-opacity-50 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden flex flex-col items-center justify-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="text-center text-lg">Waiting for host to start streaming...</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col z-[500]">
      {/* Header */}
      <header className="bg-gray-800 py-3 px-4 shadow-md flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-purple-600 rounded-md flex items-center justify-center mr-3">
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
          {isHost && (
            <button 
              className="flex items-center justify-center h-10 px-4 mr-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
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
      <div className={`flex flex-1 ${showChat ? 'flex-row' : 'flex-col'}`}>
        {/* Video Stream Container */}
        <div className={`${showChat ? 'w-3/4' : 'w-full'} h-full relative`} ref={mainVideoRef}>
          {renderVideoGrid()}
        </div>

        {/* Chat Panel */}
        {showChat && (
          <ChatPanel
            showChat={showChat}
            setShowChat={setShowChat}
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
          />
        )}
      </div>

      {/* Controls */}
      <StreamControls
        isHost={isHost}
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isFullscreen={isFullscreen}
        showChat={showChat}
        toggleMute={handleToggleMute}
        toggleVideo={handleToggleVideo}
        toggleFullscreen={toggleFullscreen}
        setShowChat={setShowChat}
      />
    </div>
  );
};

export default StreamView;