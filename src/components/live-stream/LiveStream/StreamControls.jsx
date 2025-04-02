// import React from 'react';

// const StreamControls = ({
//   isHost,
//   isMuted,
//   isVideoOff,
//   isFullscreen,
//   showChat,
//   toggleMute,
//   toggleVideo,
//   toggleFullscreen,
//   setShowChat
// }) => (
//   <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-3 flex justify-center space-x-4">
//     {isHost && (
//       <>
//         <button
//           onClick={toggleMute}
//           className={`p-3 rounded-full ${isMuted ? 'bg-red-600' : 'bg-gray-700'} hover:bg-opacity-80 transition-colors`}
//           title={isMuted ? 'Unmute' : 'Mute'}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6 text-white"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             {isMuted ? (
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
//               />
//             ) : (
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
//               />
//             )}
//           </svg>
//         </button>
//         <button
//           onClick={toggleVideo}
//           className={`p-3 rounded-full ${isVideoOff ? 'bg-red-600' : 'bg-gray-700'} hover:bg-opacity-80 transition-colors`}
//           title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6 text-white"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
//             />
//           </svg>
//         </button>
//       </>
//     )}
//     <button
//       onClick={toggleFullscreen}
//       className="p-3 rounded-full bg-gray-700 hover:bg-opacity-80 transition-colors"
//       title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
//     >
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="h-6 w-6 text-white"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//       >
//         {isFullscreen ? (
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
//           />
//         ) : (
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
//           />
//         )}
//       </svg>
//     </button>
//     <button
//       onClick={() => setShowChat(!showChat)}
//       className="p-3 rounded-full bg-gray-700 hover:bg-opacity-80 transition-colors"
//       title={showChat ? 'Hide Chat' : 'Show Chat'}
//     >
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="h-6 w-6 text-white"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
//         />
//       </svg>
//     </button>
//   </div>
// );

// export default StreamControls;

import React from "react";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Maximize, 
  Minimize, 
  MessageSquare, 
  X 
} from 'lucide-react';

const StreamControls = ({
  isHost,
  isMuted,
  isVideoOff,
  isFullscreen,
  showChat,
  toggleMute,
  toggleVideo,
  toggleFullscreen,
  setShowChat,
}) => (
  <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-3 flex justify-center space-x-4">
    {isHost && (
      <>
        {/* <button
          onClick={toggleMute}
          className={`p-3 rounded-full ${isMuted ? 'bg-red-600' : 'bg-gray-700'} hover:bg-opacity-80 transition-colors`}
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
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            )}
          </svg>
        </button> */}

        <button
          onClick={toggleMute}
          className={`p-3 rounded-full ${
            isMuted ? "bg-red-600" : "bg-gray-700"
          } hover:bg-opacity-80 transition-colors`}
          aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
        >
          {isMuted ? (
            <MicOff className="h-6 w-6 text-white" strokeWidth={2} />
          ) : (
            <Mic className="h-6 w-6 text-white" strokeWidth={2} />
          )}
        </button>

        {/* <button
          onClick={toggleVideo}
          className={`p-3 rounded-full ${
            isVideoOff ? "bg-red-600" : "bg-gray-700"
          } hover:bg-opacity-80 transition-colors`}
          title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
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
            d="M6 18L18 6M6 6l12 12"
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
);

export default StreamControls;
