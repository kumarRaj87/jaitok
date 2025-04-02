

// import React, { useState } from 'react';
// import { MessageSquare, Phone, Video, MoreVertical } from 'lucide-react';
// import Sidebar from '../Sidebar';

// const users = [
//   {
//     id: 1,
//     name: "Sarah Wilson",
//     avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
//     online: true,
//     lastMessage: "Hey, how are you?",
//     lastMessageTime: "2:30 PM"
//   },
//   {
//     id: 2,
//     name: "John Davis",
//     avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
//     online: true,
//     lastMessage: "Let's meet tomorrow",
//     lastMessageTime: "9:15 AM"
//   },
//   {
//     id: 3,
//     name: "Emma Thompson",
//     avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
//     online: false,
//     lastMessage: "The project is done!",
//     lastMessageTime: "Yesterday"
//   },
//   {
//     id: 4,
//     name: "Kumar Raja",
//     avatar: "https://cdn.pixabay.com/photo/2019/09/24/06/26/painter-4500401_640.jpg",
//     online: true,
//     lastMessage: "Hey, how are you?",
//     lastMessageTime: "2:30 PM"
//   },
//   {
//     id: 5,
//     name: "tejas",
//     avatar: "https://cdn.pixabay.com/photo/2023/07/12/17/16/training-8122941_640.jpg",
//     online: false,
//     lastMessage: "Let's meet tomorrow",
//     lastMessageTime: "9:15 AM"
//   },
//   {
//     id: 6,
//     name: "Rakesh G.",
//     avatar: "https://cdn.pixabay.com/photo/2023/10/16/03/44/daughter-8318355_640.jpg",
//     online: true,
//     lastMessage: "The project is done!",
//     lastMessageTime: "Yesterday"
//   }
// ];

// const mockMessages = [
//   { id: 1, userId: 1, text: "Hey, how are you?", timestamp: "2:30 PM", sent: false },
//   { id: 2, userId: 1, text: "I'm working on the new design", timestamp: "2:31 PM", sent: true },
//   { id: 3, userId: 1, text: "It's looking great!", timestamp: "2:32 PM", sent: false },
// ];

// function Chat() {
//   const [selectedUser, setSelectedUser] = useState(users[0]);
//   const [messageInput, setMessageInput] = useState('');

//   const handleSendMessage = () => {
//     if (messageInput.trim()) {
//       setMessageInput('');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="min-h-[50vh] w-full overflow-y-auto lg:pl-72 pl-0 overflow-x-hidden">

//       <div className="flex h-full bg-gray-100  lg:w-[85%] items-end w-full">
//         {/* Fixed Sidebar */}

//         <div className="w-64 bg-white border-r border-gray-200 fixed h-full">
//           <div className="p-6 border-b border-gray-200">
//             <h1 className="text-xl font-semibold">Messages</h1>
//           </div>
//           <div className="overflow-y-auto h-[calc(100vh-73px)]">
//             {users.map(user => (
//               <div
//                 key={user.id}
//                 onClick={() => setSelectedUser(user)}
//                 className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${selectedUser.id === user.id ? 'bg-gray-50' : ''
//                   }`}
//               >
//                 <div className="relative">
//                   <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
//                   <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user.online ? 'bg-green-500' : 'bg-red-500'
//                     }`} />
//                 </div>
//                 <div className="ml-4 flex-1">
//                   <h2 className="font-semibold">{user.name}</h2>
//                   <p className="text-sm text-gray-500">{user.lastMessage}</p>
//                 </div>
//                 <span className="text-xs text-gray-400">{user.lastMessageTime}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Chat Area */}
//         <div className="flex-1 ml-64">
//           {selectedUser ? (
//             <div className="flex flex-col h-screen">
//               {/* Chat Header */}
//               <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
//                 <div className="flex items-center">
//                   <img src={selectedUser.avatar} alt={selectedUser.name} className="w-10 h-10 rounded-full object-cover" />
//                   <div className="ml-4">
//                     <h2 className="font-semibold">{selectedUser.name}</h2>
//                     <div className="flex items-center">
//                       <div className={`w-2 h-2 rounded-full ${selectedUser.online ? 'bg-green-500' : 'bg-red-500'}`} />
//                       <span className="text-sm text-gray-500 ml-2">{selectedUser.online ? 'Online' : 'Offline'}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-8">
//                   <Phone className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
//                   <Video className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
//                   <MoreVertical className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
//                 </div>
//               </div>

//               {/* Messages Area */}
//               <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
//                 {mockMessages.map(message => (
//                   <div key={message.id} className={`flex ${message.sent ? 'justify-end' : 'justify-start'} mb-4`}>
//                     <div className={`max-w-[70%] ${message.sent ? 'bg-blue-500 text-white rounded-l-lg rounded-br-lg' : 'bg-white text-gray-800 rounded-r-lg rounded-bl-lg'} p-3 shadow`}>
//                       <p>{message.text}</p>
//                       <span className={`text-xs ${message.sent ? 'text-blue-100' : 'text-gray-400'} block mt-1`}>{message.timestamp}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Message Input */}
//               <div className="p-4 border-t border-gray-200 bg-white">
//                 <div className="flex items-center space-x-2">
//                   <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type a message..." className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
//                   <button onClick={handleSendMessage} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
//                     <MessageSquare className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="flex items-center justify-center h-full bg-gray-50">
//               <p className="text-gray-500">Select a chat to start messaging</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>

//   );
// }

// export default Chat;

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Phone, Video, MoreVertical, Search, Paperclip, Send, Smile, User, Settings, ArrowLeft, Star, ChevronDown, Mic, Image } from 'lucide-react';

const users = [
  {
    id: 1,
    name: "Sarah Wilson",
    avatar: "/api/placeholder/48/48",
    online: true,
    lastMessage: "Hey, how are you?",
    lastMessageTime: "2:30 PM",
    unread: 2
  },
  {
    id: 2,
    name: "John Davis",
    avatar: "/api/placeholder/48/48",
    online: true,
    lastMessage: "Let's meet tomorrow",
    lastMessageTime: "9:15 AM",
    unread: 0
  },
  {
    id: 3,
    name: "Emma Thompson",
    avatar: "/api/placeholder/48/48",
    online: false,
    lastMessage: "The project is done!",
    lastMessageTime: "Yesterday",
    unread: 0,
    lastSeen: "3h ago"
  },
  {
    id: 4,
    name: "Kumar Raja",
    avatar: "/api/placeholder/48/48",
    online: true,
    lastMessage: "Hey, how are you?",
    lastMessageTime: "2:30 PM",
    unread: 5
  },
  {
    id: 5,
    name: "Tejas Patel",
    avatar: "/api/placeholder/48/48",
    online: false,
    lastMessage: "Let's meet tomorrow",
    lastMessageTime: "9:15 AM",
    unread: 0,
    lastSeen: "1d ago"
  },
  {
    id: 6,
    name: "Rakesh G.",
    avatar: "/api/placeholder/48/48",
    online: true,
    lastMessage: "The project is done!",
    lastMessageTime: "Yesterday",
    unread: 0
  }
];

const mockMessages = [
  { id: 1, userId: 1, text: "Hey, how are you doing today?", timestamp: "2:30 PM", sent: false, read: true },
  { id: 2, userId: 1, text: "I'm working on the new design for our client project", timestamp: "2:31 PM", sent: true, read: true },
  { id: 3, userId: 1, text: "It's looking great! Can you share a preview when you have a moment?", timestamp: "2:32 PM", sent: false, read: true },
  { id: 4, userId: 1, text: "Sure thing! I'll send it over once I finish the main layout. The color scheme we discussed works perfectly with the typography.", timestamp: "2:35 PM", sent: true, read: true },
  { id: 5, userId: 1, text: "Perfect! I'm excited to see what you've come up with. The client is eager to see our progress too.", timestamp: "2:36 PM", sent: false, read: true },
];

function Chat() {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [messages, setMessages] = useState(mockMessages);
  const [activeTab, setActiveTab] = useState('all');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    setFilteredUsers(
      users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: messages.length + 1,
        userId: selectedUser.id,
        text: messageInput,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sent: true,
        read: false
      };

      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const formatTime = (timeString) => {
    if (timeString === "Yesterday") return "Yesterday";
    return timeString;
  };

  return (
    <div className="min-h-[50vh] w-full overflow-y-auto lg:pl-72 pl-0 overflow-x-hidden flex">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-100 transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-80' : 'w-0 opacity-0 overflow-hidden'}`}>
        {/* User profile section */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h2 className="font-semibold text-gray-800">Your Name</h2>
              <p className="text-xs text-gray-500">Available</p>
            </div>
          </div>
          <div>
            <Settings className="w-5 h-5 text-gray-500 cursor-pointer hover:text-blue-600 transition" />
          </div>
        </div>

        {/* Search box */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            All Chats
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'unread' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            Unread
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'groups' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            Groups
          </button>
        </div>

        {/* Conversation list */}
        <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {filteredUsers.map(user => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 border-l-4 transition-all ${selectedUser.id === user.id
                  ? 'border-l-blue-600 bg-blue-50'
                  : 'border-l-transparent'
                }`}
            >
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover shadow-sm"
                />
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user.online ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                />
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h2 className="font-medium text-gray-900 truncate">{user.name}</h2>
                  <span className="text-xs text-gray-500">{formatTime(user.lastMessageTime)}</span>
                </div>
                <p className="text-sm text-gray-500 truncate mt-1">{user.lastMessage}</p>
              </div>
              {user.unread > 0 && (
                <span className="ml-2 bg-blue-600 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                  {user.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            {!sidebarOpen && (
              <button onClick={toggleSidebar} className="mr-4 p-1 rounded-full hover:bg-gray-100">
                <ChevronDown className="w-5 h-5 text-gray-600 transform rotate-90" />
              </button>
            )}
            {sidebarOpen && (
              <button onClick={toggleSidebar} className="mr-4 p-1 rounded-full hover:bg-gray-100 md:hidden">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div className="relative cursor-pointer" onClick={() => setShowUserInfo(!showUserInfo)}>
              <img
                src={selectedUser?.avatar}
                alt={selectedUser?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${selectedUser?.online ? 'bg-green-500' : 'bg-gray-300'
                  }`}
              />
            </div>
            <div className="ml-4 cursor-pointer" onClick={() => setShowUserInfo(!showUserInfo)}>
              <div className="flex items-center">
                <h2 className="font-semibold text-gray-800">{selectedUser?.name}</h2>
                <Star className="w-4 h-4 text-gray-400 ml-2 hover:text-yellow-400" />
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-500">
                  {selectedUser?.online ? 'Online' : `Last seen ${selectedUser?.lastSeen || 'recently'}`}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full hover:bg-gray-100 transition">
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition">
              <Video className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50" style={{ backgroundImage: "url('/api/placeholder/32/32')", backgroundSize: "200px" }}>
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="text-center my-4">
              <span className="px-3 py-1 bg-white rounded-full text-xs text-gray-500 shadow-sm">
                Today
              </span>
            </div>

            {messages.map((message, index) => {
              const previousMessage = index > 0 ? messages[index - 1] : null;
              const showAvatar = !previousMessage || previousMessage.sent !== message.sent;
              const isLastInGroup = index === messages.length - 1 || messages[index + 1].sent !== message.sent;

              return (
                <div key={message.id} className={`flex ${message.sent ? 'justify-end' : 'justify-start'}`}>
                  {!message.sent && showAvatar && (
                    <div className="flex-shrink-0 mr-2 self-end">
                      <img src={selectedUser.avatar} alt="" className="w-8 h-8 rounded-full" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] ${message.sent
                        ? 'bg-blue-600 text-white rounded-t-lg rounded-l-lg'
                        : 'bg-white text-gray-800 rounded-t-lg rounded-r-lg'
                      } p-3 shadow-sm ${isLastInGroup ? (message.sent ? 'rounded-br-lg' : 'rounded-bl-lg') : ''}`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <div className="flex justify-end items-center mt-1 space-x-1">
                      <span className={`text-xs ${message.sent ? 'text-blue-200' : 'text-gray-400'}`}>
                        {message.timestamp}
                      </span>
                      {message.sent && (
                        <span className="text-xs text-blue-200">
                          {message.read ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-100 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end space-x-2">
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-100 transition">
                  <Paperclip className="w-5 h-5 text-gray-500" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 transition">
                  <Image className="w-5 h-5 text-gray-500" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 transition">
                  <Mic className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="flex-1 rounded-2xl border border-gray-200 bg-white focus-within:border-blue-300 focus-within:ring-1 focus-within:ring-blue-300">
                <textarea
                  rows="1"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="block w-full py-2 px-4 text-gray-800 placeholder-gray-400 rounded-2xl resize-none bg-transparent border-0 focus:ring-0 focus:outline-none text-sm"
                  style={{ minHeight: "40px", maxHeight: "120px" }}
                />
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-100 transition">
                  <Smile className="w-5 h-5 text-gray-500" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className={`p-3 rounded-full transition ${messageInput.trim()
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-100 text-gray-400'
                    }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Sidebar */}
      {showUserInfo && (
        <div className="w-64 bg-white border-l border-gray-100 shadow-md flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Profile</h3>
            <button onClick={() => setShowUserInfo(false)} className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col items-center">
              <img
                src={selectedUser?.avatar}
                alt={selectedUser?.name}
                className="w-24 h-24 rounded-full object-cover shadow-sm"
              />
              <h2 className="mt-4 font-semibold text-lg text-gray-800">{selectedUser?.name}</h2>
              <p className="text-sm text-gray-500">
                {selectedUser?.online ? 'Online' : `Last seen ${selectedUser?.lastSeen || 'recently'}`}
              </p>

              <div className="flex justify-around w-full mt-6">
                <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                  <MessageSquare className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                  <Video className="w-5 h-5" />
                </button>
              </div>

              <div className="w-full mt-6 space-y-4">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Email</h4>
                  <p className="text-sm text-gray-800">{selectedUser?.name.toLowerCase().replace(' ', '.') + '@example.com'}</p>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Shared Files</h4>
                  <div className="space-y-2">
                    <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                      <div className="bg-blue-100 p-2 rounded">
                        <Image className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs font-medium">Project_design.jpg</p>
                        <p className="text-xs text-gray-500">2.3 MB</p>
                      </div>
                    </div>
                    <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                      <div className="bg-blue-100 p-2 rounded">
                        <Image className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs font-medium">Meeting_notes.pdf</p>
                        <p className="text-xs text-gray-500">1.5 MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-100">
            <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition">
              Block Contact
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;