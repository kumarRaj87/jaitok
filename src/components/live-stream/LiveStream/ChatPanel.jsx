import React from 'react';

const ChatPanel = ({
  showChat,
  setShowChat,
  messages,
  newMessage,
  setNewMessage,
  handleSendMessage
}) => (
  <div className="w-1/4 bg-gray-800 border-l border-gray-700 flex flex-col h-[80vh]">
    <div className="p-3 border-b border-gray-700 flex justify-between items-center">
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
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white text-sm font-medium flex-shrink-0 mr-2">
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
);

export default ChatPanel;