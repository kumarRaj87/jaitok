// import { IoArrowBack } from 'react-icons/io5';
// import { FaUser, FaLock, FaBell, FaBuilding, FaAd, FaClock, FaVideo } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

// const menuItems = [
//   { icon: FaUser, text: 'Manage account', id: 'manage-account' },
//   { icon: FaLock, text: 'Privacy', id: 'privacy' },
//   { icon: FaBell, text: 'Push notifications', id: 'notifications' },
//   { icon: FaBuilding, text: 'Business account', id: 'business' },
//   { icon: FaAd, text: 'Ads', id: 'ads' },
//   { icon: FaClock, text: 'Screen time', id: 'screen-time' },
//   { icon: FaVideo, text: 'Content preferences', id: 'content' },
// ];

// function SettingsSidebar({ onMenuClick }) {
//     const navigate = useNavigate()
//   return (
//     <div className="w-full md:w-1/4 bg-white h-[70vh] sticky top-16 rounded-xl shadow-sm border-[1px] border-gray-200 m-5">
//       <div className="p-4">
//         <button className="flex items-center text-gray-700 hover:text-gray-900" onClick={()=> navigate("/")}>
//           <IoArrowBack className="w-6 h-6" />
//         </button>
//       </div>
//       <nav className="mt-2">
//         {menuItems.map((item) => (
//           <button
//             key={item.id}
//             onClick={() => onMenuClick(item.id)}
//             className="w-full flex items-center px-6 py-3 text-left hover:bg-gray-50"
//           >
//             <item.icon 
//               className="w-5 h-5 mr-4" 
//               style={{ color: item.color || '#161823' }}
//             />
//             <span 
//               className="text-[15px]"
//               style={{ color: item.color || '#161823' }}
//             >
//               {item.text}
//             </span>
//           </button>
//         ))}
//       </nav>
//     </div>
//   );
// }

// export default SettingsSidebar;


import { useState, useRef, useEffect } from 'react';
import { IoArrowBack, IoMenu, IoClose } from 'react-icons/io5';
import { FaUser, FaLock, FaBell, FaBuilding, FaAd, FaClock, FaVideo } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { icon: FaUser, text: 'Manage account', id: 'manage-account' },
  { icon: FaLock, text: 'Privacy', id: 'privacy' },
  { icon: FaBell, text: 'Push notifications', id: 'notifications' },
  { icon: FaBuilding, text: 'Business account', id: 'business' },
  { icon: FaAd, text: 'Ads', id: 'ads' },
  { icon: FaClock, text: 'Screen time', id: 'screen-time' },
  { icon: FaVideo, text: 'Content preferences', id: 'content' },
];

function SettingsSidebar({ onMenuClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && 
          mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) &&
          hamburgerRef.current &&
          !hamburgerRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile/Tablet Header with Hamburger (shows on screens < 1024px) */}
      <div className="xl:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center space-x-4">
          <button 
            className="flex items-center text-gray-700 hover:text-gray-900"
            onClick={() => navigate("/")}
          >
            <IoArrowBack className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium">Settings</h1>
        </div>
        <button 
          ref={hamburgerRef}
          className="text-gray-700 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <IoClose className="w-6 h-6" />
          ) : (
            <IoMenu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Desktop Sidebar (shows only on screens ≥ 1024px) */}
      <div className="hidden xl:flex flex-col w-1/4 bg-white h-[70vh] sticky top-16 rounded-xl shadow-sm border-[1px] border-gray-200 m-5">
        <div className="p-4">
          <button 
            className="flex items-center text-gray-700 hover:text-gray-900"
            onClick={() => navigate("/")}
          >
            <IoArrowBack className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onMenuClick(item.id)}
              className="w-full flex items-center px-6 py-3 text-left hover:bg-gray-50"
            >
              <item.icon 
                className="w-5 h-5 mr-4" 
                style={{ color: item.color || '#161823' }}
              />
              <span 
                className="text-[15px]"
                style={{ color: item.color || '#161823' }}
              >
                {item.text}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile/Tablet Sidebar Menu (slides in from right) */}
      {isMobileMenuOpen && (
        <>
          <div 
            ref={mobileMenuRef}
            className="xl:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-40"
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10">
              <h2 className="text-lg font-semibold">Settings Menu</h2>
              <button 
                onClick={toggleMobileMenu}
                className="text-gray-700 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
                aria-label="Close menu"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>
            <nav className="overflow-y-auto h-full pb-20">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onMenuClick(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-6 py-4 text-left hover:bg-gray-50 border-b border-gray-100"
                >
                  <item.icon 
                    className="w-5 h-5 mr-4" 
                    style={{ color: item.color || '#161823' }}
                  />
                  <span 
                    className="text-[15px]"
                    style={{ color: item.color || '#161823' }}
                  >
                    {item.text}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Overlay */}
          <div 
            className="xl:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
            onClick={toggleMobileMenu}
          />
        </>
      )}
    </>
  );
}

export default SettingsSidebar;