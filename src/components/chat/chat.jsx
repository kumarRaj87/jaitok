// import { useEffect, useState, useRef } from "react";
// import AgoraChat from "agora-chat";

// function Chat() {
//   // App key provided
//   const appKey = "611268033#1526202";
//   const [userId, setUserId] = useState("");
//   const [token, setToken] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [peerId, setPeerId] = useState("");
//   const [message, setMessage] = useState("");
//   const [logs, setLogs] = useState([]);
//   const chatClient = useRef(null);
//   const logContainerRef = useRef(null);

//   // Auto-scroll logs to bottom
//   useEffect(() => {
//     if (logContainerRef.current) {
//       logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
//     }
//   }, [logs]);

//   // Logs into Agora Chat
//   const handleLogin = () => {
//     if (userId && token) {
//       chatClient.current.open({
//         user: userId,
//         accessToken: token,
//       });
//       addLog("Connecting to Agora Chat...");
//     } else {
//       addLog("⚠️ Please enter both user ID and token");
//     }
//   };

//   // Logs out
//   const handleLogout = () => {
//     chatClient.current.close();
//     setIsLoggedIn(false);
//     setUserId("");
//     setToken("");
//     setPeerId("");
//     addLog("Logging out...");
//   };

//   // Sends a peer-to-peer message
//   const handleSendMessage = async () => {
//     if (!peerId.trim()) {
//       addLog("⚠️ Please enter a recipient user ID");
//       return;
//     }

//     if (message.trim()) {
//       try {
//         const options = {
//           chatType: "singleChat", // Sets the chat type as a one-to-one chat
//           type: "txt", // Sets the message type
//           to: peerId, // Sets the recipient of the message with user ID
//           msg: message, // Sets the message content
//         };
//         let msg = AgoraChat.message.create(options);

//         await chatClient.current.send(msg);
//         addLog(`✅ Message sent to ${peerId}: ${message}`);
//         setMessage("");
//       } catch (error) {
//         addLog(`❌ Message failed to send: ${error.message}`);
//       }
//     } else {
//       addLog("⚠️ Please enter a message");
//     }
//   };

//   // Handle pressing Enter key to send message
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && message.trim()) {
//       handleSendMessage();
//     }
//   };

//   // Add log with timestamp
//   const addLog = (log) => {
//     const now = new Date();
//     const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
//     setLogs((prevLogs) => [...prevLogs, `[${timestamp}] ${log}`]);
//   };

//   useEffect(() => {
//     // Initialize the Web client
//     chatClient.current = new AgoraChat.connection({
//       appKey: appKey,
//     });

//     // Add the event handler
//     chatClient.current.addEventHandler("connection&message", {
//       // Occurs when the app is connected to Agora Chat
//       onConnected: () => {
//         setIsLoggedIn(true);
//         addLog(`🟢 Connected as ${userId}`);
//       },
//       // Occurs when the app is disconnected from Agora Chat
//       onDisconnected: () => {
//         setIsLoggedIn(false);
//         addLog(`🔴 Disconnected`);
//       },
//       // Occurs when a text message is received
//       onTextMessage: (message) => {
//         addLog(`📩 ${message.from}: ${message.msg}`);
//       },
//       // Occurs when the token is about to expire
//       onTokenWillExpire: () => {
//         addLog("⚠️ Token is about to expire");
//       },
//       // Occurs when the token has expired
//       onTokenExpired: () => {
//         addLog("⚠️ Token has expired");
//       },
//       onError: (error) => {
//         addLog(`❌ Error: ${error.message}`);
//       },
//     });

//     return () => {
//       // Clean up
//       if (chatClient.current) {
//         chatClient.current.removeEventHandler("connection&message");
//       }
//     };
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md">
//         {/* Header */}
//         <div className="bg-rose-600 text-white p-4">
//           <h2 className="text-xl font-bold">Agora Chat</h2>
//           {isLoggedIn && (
//             <p className="text-rose-100 text-sm">Connected as {userId}</p>
//           )}
//         </div>

//         {/* Content */}
//         <div className="p-4">
//           {!isLoggedIn ? (
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   User ID
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
//                   value={userId}
//                   onChange={(e) => setUserId(e.target.value)}
//                   placeholder="Enter your user ID"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Token
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
//                   value={token}
//                   onChange={(e) => setToken(e.target.value)}
//                   placeholder="Enter your token"
//                 />
//               </div>
//               <button
//                 onClick={handleLogin}
//                 className="w-full bg-rose-600 text-white py-2 px-4 rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors"
//               >
//                 Login
//               </button>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-lg font-medium text-gray-900">
//                   Send Message
//                 </h3>
//                 <button
//                   onClick={handleLogout}
//                   className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
//                 >
//                   Logout
//                 </button>
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Recipient ID
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
//                   value={peerId}
//                   onChange={(e) => setPeerId(e.target.value)}
//                   placeholder="Enter recipient's user ID"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Message
//                 </label>
//                 <div className="flex space-x-2">
//                   <input
//                     type="text"
//                     className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     onKeyPress={handleKeyPress}
//                     placeholder="Type your message here"
//                   />
//                   <button
//                     onClick={handleSendMessage}
//                     className="bg-rose-600 text-white py-2 px-4 rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors"
//                   >
//                     Send
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Log section */}
//           <div className="mt-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-2">Activity Log</h3>
//             <div
//               ref={logContainerRef}
//               className="h-64 overflow-y-auto border border-gray-200 rounded-md p-3 bg-gray-50 text-sm font-mono"
//             >
//               {logs.length === 0 ? (
//                 <p className="text-gray-500 italic">No activity yet</p>
//               ) : (
//                 logs.map((log, index) => (
//                   <div key={index} className="py-1 border-b border-gray-100 last:border-0">
//                     {log}
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Chat;

import { useEffect, useState, useRef } from "react";
import AgoraChat from "agora-chat";
import ChatInterface from "./ChatInterface";
import { motion } from 'framer-motion';
import toast from "react-hot-toast";

function Chat() {
  // App key provided
  const appKey = "611268033#1526202";
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [peerId, setPeerId] = useState("");
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [conversations, setConversations] = useState({});
  const chatClient = useRef(null);
  const logContainerRef = useRef(null);
  const chatHistoryRef = useRef(null);

  // Auto-scroll logs to bottom
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Auto-scroll chat history to bottom
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [conversations, activeUser]);

  // Sample users data - in a real app, this would come from Agora's roster
  useEffect(() => {
    if (isLoggedIn) {
      // Simulating fetching users - in a real app, you would use Agora's roster API
      setUsers([
        { id: "Jhon", name: "Jhon", status: "online", lastMessage: "WhatsUp!" },
        { id: "alice", name: "Alice", status: "online", lastMessage: "Hello there!" },
        { id: "bob", name: "Bob", status: "offline", lastMessage: "See you tomorrow" },
        { id: "Charlie", name: "Charlie", status: "away", lastMessage: "In a meeting" },
        { id: "diana", name: "Diana", status: "online", lastMessage: "Got your message" },
        { id: "ram", name: "Ram", status: "online", lastMessage: "How are you ?" },
      ]);
    }
  }, [isLoggedIn]);

  // Logs into Agora Chat
  const handleLogin = () => {
    if (userId && token) {
      chatClient.current.open({
        user: userId,
        accessToken: token,
      });
      addLog("Connecting to Agora Chat...");
      toast.success("loggedin successfully!")
    } else {
      addLog("⚠️ Please enter both user ID and token");
      toast.error("⚠️ Please enter both user ID and token")
    }
  };

  const [focusedField, setFocusedField] = useState(null);

  // Logs out
  const handleLogout = () => {
    chatClient.current.close();
    setIsLoggedIn(false);
    setUserId("");
    setToken("");
    setPeerId("");
    setActiveUser(null);
    setUsers([]);
    setConversations({});
    addLog("Logging out...");
  };

  // Selects a user to chat with
  const selectUser = (user) => {
    setPeerId(user.id);
    setActiveUser(user);

    // Initialize conversation if it doesn't exist
    if (!conversations[user.id]) {
      setConversations(prev => ({
        ...prev,
        [user.id]: []
      }));
    }
  };

  // Sends a peer-to-peer message
  const handleSendMessage = async () => {
    if (!peerId.trim()) {
      addLog("⚠️ Please select a recipient");
      return;
    }

    if (message.trim()) {
      try {
        const options = {
          chatType: "singleChat", // Sets the chat type as a one-to-one chat
          type: "txt", // Sets the message type
          to: peerId, // Sets the recipient of the message with user ID
          msg: message, // Sets the message content
        };
        let msg = AgoraChat.message.create(options);

        await chatClient.current.send(msg);

        // Add to local conversation history
        const newMessage = {
          from: userId,
          to: peerId,
          content: message,
          timestamp: new Date().toISOString(),
          status: "sent"
        };

        setConversations(prev => ({
          ...prev,
          [peerId]: [...(prev[peerId] || []), newMessage]
        }));

        addLog(`✅ Message sent to ${peerId}: ${message}`);
        setMessage("");
      } catch (error) {
        addLog(`❌ Message failed to send: ${error.message}`);
      }
    } else {
      addLog("⚠️ Please enter a message");
    }
  };

  // Handle pressing Enter key to send message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && message.trim()) {
      handleSendMessage();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const inputVariants = {
    focused: { scale: 1.02, boxShadow: "0 4px 20px rgba(236, 72, 153, 0.15)" },
    unfocused: { scale: 1, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.03, boxShadow: "0 6px 20px rgba(236, 72, 153, 0.2)" },
    tap: { scale: 0.98 }
  };

  // Add log with timestamp
  const addLog = (log) => {
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    setLogs((prevLogs) => [...prevLogs, `[${timestamp}] ${log}`]);
  };

  useEffect(() => {
    // Initialize the Web client
    chatClient.current = new AgoraChat.connection({
      appKey: appKey,
    });

    // Add the event handler
    chatClient.current.addEventHandler("connection&message", {
      // Occurs when the app is connected to Agora Chat
      onConnected: () => {
        setIsLoggedIn(true);
        addLog(`🟢 Connected as ${userId}`);
      },
      // Occurs when the app is disconnected from Agora Chat
      onDisconnected: () => {
        setIsLoggedIn(false);
        addLog(`🔴 Disconnected`);
      },
      // Occurs when a text message is received
      onTextMessage: (message) => {
        addLog(`📩 ${message.from}: ${message.msg}`);

        // Add to conversation history
        const newMessage = {
          from: message.from,
          to: userId,
          content: message.msg,
          timestamp: new Date().toISOString(),
          status: "received"
        };

        setConversations(prev => {
          const updatedConversations = { ...prev };

          if (!updatedConversations[message.from]) {
            updatedConversations[message.from] = [];
          }

          updatedConversations[message.from].push(newMessage);
          return updatedConversations;
        });
      },
      // Occurs when the token is about to expire
      onTokenWillExpire: () => {
        addLog("⚠️ Token is about to expire");
      },
      // Occurs when the token has expired
      onTokenExpired: () => {
        addLog("⚠️ Token has expired");
      },
      onError: (error) => {
        addLog(`❌ Error: ${error.message}`);
      },
    });

    return () => {
      // Clean up
      if (chatClient.current) {
        chatClient.current.removeEventHandler("connection&message");
      }
    };
  }, []);

  return (
    <div className="h-[100vh] w-full overflow-y-auto lg:pl-64 pl-0 overflow-x-hidden justify-center flex items-center">
      {!isLoggedIn ? (
        <motion.div
          className="bg-white rounded-2xl shadow-md overflow-hidden w-full max-w-md border border-gray-100"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Decorative top design element */}
          <div className="relative h-16 bg-gradient-to-r from-rose-500 to-pink-600">
            <motion.div
              className="absolute -bottom-8 left-0 right-0 flex justify-center"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="h-16 w-16 rounded-full bg-white shadow-lg flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-rose-600"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            </motion.div>
          </div>

          {/* Header */}
          <div className="pt-12 pb-4 px-8 text-center">
            <motion.h2
              className="text-2xl font-bold text-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Welcome to Agora Chat
            </motion.h2>
            <motion.p
              className="text-gray-500 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Please sign in to continue
            </motion.p>
          </div>

          {/* Login Form */}
          <div className="p-8 pt-4 space-y-6">
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-medium text-gray-700 ml-1">
                User ID
              </label>
              <motion.div
                variants={inputVariants}
                animate={focusedField === 'userId' ? 'focused' : 'unfocused'}
                transition={{ duration: 0.2 }}
              >
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 bg-gray-50 text-gray-800"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter your user ID"
                  onFocus={() => setFocusedField('userId')}
                  onBlur={() => setFocusedField(null)}
                />
              </motion.div>
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-sm font-medium text-gray-700 ml-1">
                Token
              </label>
              <motion.div
                variants={inputVariants}
                animate={focusedField === 'token' ? 'focused' : 'unfocused'}
                transition={{ duration: 0.2 }}
              >
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 bg-gray-50 text-gray-800"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter your token"
                  onFocus={() => setFocusedField('token')}
                  onBlur={() => setFocusedField(null)}
                />
              </motion.div>
            </motion.div>

            <motion.button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 px-4 rounded-xl focus:outline-none font-medium shadow-md"
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              transition={{ duration: 0.2 }}
            >
              Sign In
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <ChatInterface userId={userId} users={users} handleLogout={handleLogout} conversations={conversations} setMessage={setMessage} message={message} handleSendMessage={handleSendMessage} handleKeyPress={handleKeyPress} activeUser={activeUser} selectUser={selectUser} logs={logs} />
      )}
    </div>
  );
}

export default Chat; 