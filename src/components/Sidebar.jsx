import React, { useState, useEffect, useMemo } from 'react';
import { Home, Compass, Users, UserPlus, Upload, Activity, MessageCircle, Video, User, MoreHorizontal, X, Coins, Wand2, Settings, HelpCircle, Moon, LogOut, Bell, Heart, MessageSquare, UserPlus2, Search, Menu } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showMoreDialog, setShowMoreDialog] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const limit = 10;

  const navigate = useNavigate()

  const { logout } = useAuth()

  const searchSuggestions = [
    'Popular creators',
    'Trending hashtags',
    'Latest videos',
    'Music trends',
    'Dance challenges',
    'Comedy sketches',
    'Educational content',
    'DIY & Crafts',
    'Beauty & Fashion',
    'Food & Recipes'
  ];

  const recentSearches = [
    'Dance tutorial',
    'Cooking tips',
    'Workout routine',
    'Travel vlog'
  ];

  useEffect(() => {
    if (showNotifications) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [showNotifications, page, activeTab]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        toast.error('Please log in to view notifications');
        return;
      }

      const response = await axios.get('https://jaitok-api.jaitia.com/notifications', {
        params: { page: 1, limit: 10 },
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'access-token': authToken,
        },
      });

      const fetchedNotifications = response.data.data.notifications || [];
      console.log("fetchedNotifications", fetchedNotifications);

      setNotifications(page === 1 ? fetchedNotifications : [...notifications, ...fetchedNotifications]);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error(error.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) return;

      const response = await axios.get('https://jaitok-api.jaitia.com/notifications/unread-count', {
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'access-token': authToken,
        },
      });

      setUnreadCount(response.data.data.count || 0);
      console.log("response.data.data.count", response.data.data.count);

    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) return;

      await axios.post(`https://jaitok-api.jaitia.com/notifications/${notificationId}/read`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'access-token': authToken,
        },
      });

      // Update unread count and notification state
      setUnreadCount(Math.max(0, unreadCount - 1));
      setNotifications(notifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      ));


    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) return;

      await axios.post('https://jaitok-api.jaitia.com/notifications/mark-all-read', {}, {
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'access-token': authToken,
        },
      });

      // Update all notifications as read
      setUnreadCount(10);
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
      toast.success('All notifications marked as read');
      console.log("All notifications marked as read", toast.success('All notifications marked as read'));


    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  const fetchAllusers = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) return;

      const response = await axios.get('https://jaitok-api.jaitia.com/query/users', {
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'access-token': authToken,
        },
      });
      setAllUsers(response.data.data.users)

    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchAllusers()
  }, [])

  const filteredUsers = useMemo(() => {
    if (!Array.isArray(allUsers)) return [];
    return allUsers.filter(user =>
      user.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allUsers, searchQuery]);


  const menuItems = [
    { icon: <Home size={24} />, text: 'For You', path: "/foryou" },
    { icon: <Compass size={24} />, text: 'Explore', path: "/explore" },
    { icon: <Users size={24} />, text: 'Following', path: "/following" },
    { icon: <UserPlus size={24} />, text: 'Friends', path: "/friends" },
    { icon: <Upload size={24} />, text: 'Upload', path: "/upload" },
    { icon: <Activity size={24} />, text: 'Sound Library', path: "/sound-library" },
    { icon: <MessageCircle size={24} />, text: 'Messages', path: "/chat" },
    { icon: <Video size={24} />, text: 'LIVE', path: "/live" },
    { icon: <User size={24} />, text: 'Profile', path: "/profile" },
    {
      icon: <Bell size={24} />,
      text: 'Notifications',
      onClick: () => {
        setShowNotifications(true);
        setMobileMenuOpen(false);
      },
      badge: unreadCount > 0 ? unreadCount : null,
    },
  ];

  const moreMenuItems = [
    { icon: <Coins size={24} />, text: 'Get Coins', path: '/coins' },
    { icon: <Wand2 size={24} />, text: 'Create TikTok effects', path: '/effects' },
    { icon: <Settings size={24} />, text: 'Settings', path: '/settings' },
    { icon: <Moon size={24} />, text: 'Dark mode', path: '/dark-mode' },
    { icon: <HelpCircle size={24} />, text: 'Feedback and help', path: '/help' },
    {
      icon: <LogOut size={24} />,
      text: 'Log out',
      onClick: () => {
        logout()
        toast.success('Logged out successfully');
      }
    }
  ];

  const handleMoreClick = () => {
    setIsExpanded(false);
    setShowMoreDialog(true);
  };

  const handleCloseMore = () => {
    setShowMoreDialog(false);
    setIsExpanded(true);
  };

  const handleSearchClick = () => {
    setIsExpanded(false);
    setShowSearchPanel(true);
    setMobileMenuOpen(false);
  };

  const handleCloseSearch = () => {
    setShowSearchPanel(false);
    setIsExpanded(true);
    setSearchQuery('');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (showSearchPanel) setShowSearchPanel(false);
    if (showMoreDialog) setShowMoreDialog(false);
  };

  const handleMenuItemClick = (item) => {
    if (item.onClick) {
      item.onClick();
    } else {
      navigate(item.path);
    }
    setMobileMenuOpen(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart size={16} className="text-red-500" />;
      case 'comment':
        return <MessageSquare size={16} className="text-blue-500" />;
      case 'follow':
        return <UserPlus2 size={16} className="text-green-500" />;
      case 'mention':
        return <User size={16} className="text-purple-500" />;
      default:
        return <Bell size={16} />;
    }
  };

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <>
      {/* Mobile Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="flex justify-between items-center px-4 py-2">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg"
              alt="TikTok Logo"
              className="h-8"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSearchClick}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <Search size={24} />
            </button>
            <button
              onClick={() => setShowNotifications(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell size={24} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      <div className={`lg:hidden fixed top-0 left-0 h-screen w-64 bg-white z-40 shadow-lg transition-transform duration-300 ease-in-out transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="pt-16 pb-4 h-full flex flex-col">
          {/* User info section */}
          {/* <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={20} />
              </div>
              <div>
                <p className="font-medium">Sign in</p>
                <p className="text-xs text-gray-500">Create videos and more</p>
              </div>
            </div>
          </div> */}

          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {/* Display avatar if available, otherwise show User icon */}
              {storedUser?.avatar ? (
                <img
                  src={storedUser.avatar}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={20} />
                </div>
              )}

              <div>
                {/* Display first name + last name with first letters capitalized */}
                <p className="font-medium">
                  {storedUser?.firstName
                    ? `${storedUser.firstName.charAt(0).toUpperCase()}${storedUser.firstName.slice(1)} 
             ${storedUser.lastName.charAt(0).toUpperCase()}${storedUser.lastName.slice(1)}`
                    : "Sign in"}
                </p>
                {/* Display email if available */}
                <p className="text-xs text-gray-500">{storedUser?.email || "Create videos and more"}</p>
              </div>
            </div>
          </div>


          {/* Navigation Menu */}
          <nav className="overflow-y-auto flex-grow">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className="w-full flex items-center px-4 py-3 hover:bg-gray-100 transition-colors relative"
                onClick={() => handleMenuItemClick(item)}
              >
                <span className="flex justify-center items-center min-w-[32px]">
                  {item.icon}
                </span>
                <span className="ml-4 text-sm font-medium">{item.text}</span>
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}

            {/* More section with divider */}
            <div className="border-t border-gray-200 my-2 pt-2">
              <div className="px-4 py-2">
                <p className="text-xs font-medium text-gray-500 uppercase">More</p>
              </div>
              {moreMenuItems.map((item, index) => (
                <button
                  key={index}
                  className="w-full flex items-center px-4 py-3 hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    } else {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }
                  }}
                >
                  <span className="flex justify-center items-center min-w-[32px]">
                    {item.icon}
                  </span>
                  <span className="ml-4 text-sm font-medium">{item.text}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="mt-auto px-4 py-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">© 2024 TikTok Clone</p>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar - Keep original implementation */}
      <div className='hidden lg:block'>
        {/* Main Sidebar */}
        <div className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 pt-4 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'}`}>
          {/* TikTok Logo */}
          <div className="flex justify-center items-center mb-6">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg"
              alt="TikTok Logo"
              className={`h-8 transition-all duration-300 ${isExpanded ? 'scale-100' : 'scale-75'}`}
            />
          </div>

          {/* Search Bar */}
          {isExpanded && (
            <div className="px-4 mb-4">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 rounded-full bg-gray-100 focus:outline-none"
                onClick={handleSearchClick}
              />
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="mt-2 overflow-y-auto h-[70vh]">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className="w-full flex cursor-pointer items-center px-4 py-3 hover:bg-gray-100 transition-colors relative"
                onClick={item.onClick || (() => navigate(item.path))}
              >
                <span className="flex justify-center items-center min-w-[32px]">
                  {item.icon}
                  {item.badge && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </span>
                {isExpanded && <span className="ml-4 text-sm font-medium">{item.text}</span>}
              </button>
            ))}
            <button
              className="w-full cursor-pointer flex items-center px-4 py-3 hover:bg-gray-100 transition-colors"
              onClick={handleMoreClick}
            >
              <span className="flex justify-center items-center min-w-[32px]"><MoreHorizontal size={24} /></span>
              {isExpanded && <span className="ml-4 text-sm font-medium">More</span>}
            </button>
          </nav>

          {/* Footer */}
          {isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                <p className="mb-2">© 2024 TikTok Clone</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* More Dialog - Same as original */}
      {showMoreDialog && (
        <div className={`fixed left-16 top-0 h-screen w-72 bg-white border-r border-gray-200 z-50 transition-transform duration-300 ${showMoreDialog ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">More</h2>
            <button
              onClick={handleCloseMore}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
          <nav className="mt-2">
            {moreMenuItems.map((item, index) => (
              <button
                key={index}
                className="w-full cursor-pointer flex items-center px-4 py-3 hover:bg-gray-100 transition-colors"
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  } else {
                    navigate(item.path);
                  }
                  handleCloseMore();
                }}
              >
                <span className="flex justify-center items-center min-w-[32px]">{item.icon}</span>
                <span className="ml-4 text-sm font-medium">{item.text}</span>
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Search Panel - Same as original */}
      {showSearchPanel && (
        <div className={`fixed top-0 ${window.innerWidth < 1024 ? 'left-0 w-full h-screen' : 'left-16 w-72 h-screen'} bg-white border-r border-gray-200 z-50 transition-transform duration-300 shadow-lg`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Search</h2>
            <button
              onClick={handleCloseSearch}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search accounts and videos"
                className="w-full px-4 py-2 pl-10 pr-4 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              {searchQuery && (
                <button
                  onClick={() =>
                    setSearchQuery('')
                  }
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Recent Searches */}
            {!searchQuery && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">Recent</h3>
                  <button className="text-xs text-gray-400 hover:text-gray-600">Clear all</button>
                </div>
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <div className="flex items-center">
                      <Search size={16} className="text-gray-400 mr-3" />
                      <span className="text-sm">{search}</span>
                    </div>
                    <X size={16} className="text-gray-400 hover:text-gray-600" />
                  </div>
                ))}
              </div>
            )}

            {/* Suggested Searches */}
            {!searchQuery && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  {searchQuery ? 'Search results' : 'Suggested'}
                </h3>
                {searchSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-center py-2 px-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <Search size={16} className="text-gray-400 mr-3" />
                    <span className="text-sm">{suggestion}</span>
                  </div>
                ))}
              </div>
            )}

            {searchQuery && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Search results</h3>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      onClick={() => {
                        setShowSearchPanel(false);
                        setIsExpanded(true);
                        setSearchQuery('');
                        navigate(`/user/${user._id}`)
                      }}
                      key={user._id}
                      className="flex items-center py-2 px-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <img
                        src={user.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbBa24AAg4zVSuUsL4hJnMC9s3DguLgeQmZA&s"}
                        alt={user.username}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <div>
                        <span className="text-sm font-medium">{user.username}</span>
                        <p className="text-xs text-gray-500">{user.firstName} {user.lastName}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No users found</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notifications Modal - Same as original */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-end">
          <div className={`bg-white shadow-lg animate-slide-in ${window.innerWidth < 1024 ? 'w-full h-screen' : 'w-1/4 h-screen'}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold">Notifications</h2>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-500 hover:text-blue-600"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto h-[calc(100vh-120px)]">
              {loading && page === 1 ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent"></div>
                </div>
              ) : (
                <>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''
                        }`}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <img
                        src={notification.user?.avatar || `https://source.unsplash.com/random/100x100?face=${notification.id}`}
                        alt={notification.user?.username || 'User'}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold">
                            {notification.user?.username || 'User'}
                          </span>
                          {getNotificationIcon(notification.type)}
                          <span className="text-xs text-gray-500">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
                        {notification.media && (
                          <div className="mt-2">
                            <img
                              src={notification.media}
                              alt="Content"
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {!loading && notifications.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                      <Bell size={48} className="mb-4" />
                      <p>No notifications yet</p>
                    </div>
                  )}

                  {loading && page > 1 && (
                    <div className="flex justify-center items-center h-16">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-900 border-t-transparent"></div>
                    </div>
                  )}

                  {!loading && notifications.length >= page * limit && (
                    <button
                      onClick={() => setPage(p => p + 1)}
                      className="w-full py-3 text-blue-500 hover:bg-gray-50"
                    >
                      Load more
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add padding for mobile navbar */}
      <div className="lg:hidden h-14"></div>
    </>
  );
};

export default Sidebar;