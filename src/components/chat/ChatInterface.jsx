import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LogOut, Send, Clock, Bell, Settings, User, Activity } from 'lucide-react';

const ChatInterface = ({ userId, users, handleLogout, conversations, setMessage, message, handleSendMessage, handleKeyPress, activeUser, selectUser, logs }) => {
  const chatHistoryRef = useRef(null);
  const logContainerRef = useRef(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showActivityLog, setShowActivityLog] = useState(false);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [conversations, activeUser, logs]);

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white overflow-hidden w-full flex h-full"
      style={{ maxHeight: "100vh" }}
    >
      {/* Sidebar Toggle Button (Mobile) */}
      <motion.button
        className="md:hidden absolute top-4 left-4 z-10 bg-white p-2 rounded-full shadow-md"
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <User size={20} className="text-rose-600" />
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-80 bg-white border-r border-gray-100 flex flex-col relative shadow-sm"
          >
            {/* User Profile */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-rose-600 to-rose-800 text-white">
              <div>
                <h2 className="font-bold text-lg">{userId}</h2>
                <div className="flex items-center text-rose-100 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                  <span className="text-sm">Online</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="text-sm px-3 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 focus:outline-none backdrop-blur-sm transition-all"
              >
                <LogOut size={18} />
              </motion.button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full px-4 py-3 pl-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all bg-gray-50"
                />
                <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>

            {/* User Categories */}
            <div className="flex px-4 pt-3 pb-2 gap-2">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                className="flex-1 py-2 rounded-lg bg-rose-50 text-rose-700 text-sm font-medium"
              >
                Recent
              </motion.button>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm font-medium"
              >
                Groups
              </motion.button>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm font-medium"
              >
                All
              </motion.button>
            </div>

            {/* User List */}
            <div className="overflow-y-auto flex-1 p-2">
              <AnimatePresence>
                {users.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 text-gray-500 text-center"
                  >
                    <div className="mb-3 flex justify-center">
                      <User size={40} className="text-gray-300" />
                    </div>
                    <p>No users available</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
                  </motion.div>
                ) : (
                  users.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{
                        scale: 1.02,
                        backgroundColor: activeUser && activeUser.id === user.id ? "#EEF2FF" : "#F9FAFB"
                      }}
                      className={`p-3 mb-2 rounded-xl cursor-pointer ${activeUser && activeUser.id === user.id
                          ? "bg-rose-50 border border-rose-100"
                          : "bg-white border border-gray-100 hover:border-rose-100"
                        }`}
                      onClick={() => selectUser(user)}
                    >
                      <div className="flex items-center">
                        <div className={`relative w-12 h-12 rounded-full ${user.status === 'online' ? 'bg-gradient-to-br from-rose-500 to-rose-700' :
                            user.status === 'away' ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                              'bg-gradient-to-br from-gray-400 to-gray-600'
                          } text-white flex items-center justify-center font-bold shadow-sm`}>
                          {user.name.charAt(0).toUpperCase()}
                          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user.status === 'online' ? 'bg-green-500' :
                              user.status === 'away' ? 'bg-amber-500' : 'bg-gray-500'
                            }`}></span>
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`font-medium ${activeUser && activeUser.id === user.id ? "text-rose-700" : "text-gray-800"
                              }`}>{user.name}</span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock size={12} className="mr-1" /> 12:30
                            </span>
                          </div>
                          <p className={`text-sm mt-1 ${activeUser && activeUser.id === user.id ? "text-rose-600" : "text-gray-500"
                            } truncate`}>{user.lastMessage}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm">
          <div className="flex items-center">
            {activeUser ? (
              <>
                <div className={`relative w-10 h-10 rounded-full ${activeUser.status === 'online' ? 'bg-gradient-to-br from-rose-500 to-rose-700' :
                    activeUser.status === 'away' ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                      'bg-gradient-to-br from-gray-400 to-gray-600'
                  } text-white flex items-center justify-center font-bold shadow-sm`}>
                  {activeUser.name.charAt(0).toUpperCase()}
                  <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white ${activeUser.status === 'online' ? 'bg-green-500' :
                      activeUser.status === 'away' ? 'bg-amber-500' : 'bg-gray-500'
                    }`}></span>
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-800">{activeUser.name}</h3>
                  <div className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-1 ${activeUser.status === 'online' ? 'bg-green-500' :
                        activeUser.status === 'away' ? 'bg-amber-500' : 'bg-gray-500'
                      }`}></span>
                    <span className="text-xs text-gray-500 capitalize">{activeUser.status}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-gray-500 font-medium">Select a user to start chatting</div>
            )}
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
            >
              <Bell size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
            >
              <Settings size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 md:hidden"
              onClick={() => setShowActivityLog(!showActivityLog)}
            >
              <Activity size={20} />
            </motion.button>
          </div>
        </div>

        {/* Chat Messages */}
        <div
          ref={chatHistoryRef}
          className="flex-1 overflow-y-auto p-6 bg-gray-50"
        >
          {activeUser && conversations[activeUser.id] ? (
            conversations[activeUser.id].length > 0 ? (
              conversations[activeUser.id].map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, type: "spring", stiffness: 500, damping: 40 }}
                  className={`mb-4 flex ${msg.from === userId ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`rounded-2xl px-5 py-3 max-w-md shadow-sm ${msg.from === userId
                        ? "bg-gradient-to-r from-rose-600 to-rose-700 text-white"
                        : "bg-white text-gray-800"
                      }`}
                  >
                    <p className="leading-relaxed">{msg.content}</p>
                    <div
                      className={`text-xs mt-1 flex items-center justify-end ${msg.from === userId ? "text-rose-200" : "text-gray-400"
                        }`}
                    >
                      <Clock size={12} className="mr-1" />
                      {formatMessageTime(msg.timestamp)}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center"
              >
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                  <div className="mb-4 bg-rose-50 p-4 rounded-full inline-block">
                    <Send size={28} className="text-rose-500" />
                  </div>
                  <h3 className="font-medium text-gray-800 mb-1">No messages yet</h3>
                  <p className="text-gray-500 text-sm">Send a message to start the conversation!</p>
                </div>
              </motion.div>
            )
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center"
            >
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center max-w-md">
                <div className="mb-4 bg-rose-50 p-5 rounded-full inline-block">
                  <User size={32} className="text-rose-500" />
                </div>
                <h3 className="font-medium text-gray-800 text-lg mb-2">Welcome to your chat app</h3>
                <p className="text-gray-500">Select a user from the sidebar to start chatting</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          {activeUser ? (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex gap-3"
            >
              <input
                type="text"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all bg-gray-50"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-rose-600 to-rose-700 text-white py-3 px-6 rounded-xl hover:shadow-md focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all flex items-center"
              >
                <Send size={18} className="mr-2" />
                Send
              </motion.button>
            </motion.div>
          ) : (
            <div className="text-center py-3 text-gray-500 bg-gray-50 rounded-xl">
              Select a user to start chatting
            </div>
          )}
        </div>
      </div>

      {/* Activity Log Panel */}
      <AnimatePresence>
        {(showActivityLog || window.innerWidth >= 768) && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-80 bg-white border-l border-gray-100 flex flex-col shadow-sm"
          >
            <div className="p-4 border-b border-gray-100 bg-rose-50 flex justify-between items-center">
              <h3 className="font-medium text-rose-700 flex items-center">
                <Activity size={18} className="mr-2" />
                Activity Log
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowActivityLog(false)}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-200 md:hidden"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </motion.button>
            </div>
            <div
              ref={logContainerRef}
              className="flex-1 overflow-y-auto p-4 text-sm font-mono"
            >
              {logs.length === 0 ? (
                <div className="text-gray-500 italic p-4 text-center">
                  <div className="mb-3 bg-gray-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
                    <Clock size={24} className="text-gray-400" />
                  </div>
                  <p>No activity yet</p>
                  <p className="text-xs mt-1 text-gray-400">Activity will appear here</p>
                </div>
              ) : (
                logs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="py-2 px-3 mb-2 border-l-2 border-rose-200 bg-gray-50 rounded-r-lg hover:bg-rose-50 transition-colors"
                  >
                    {log}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatInterface;