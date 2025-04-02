import { IoArrowBack } from 'react-icons/io5';
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
    const navigate = useNavigate()
  return (
    <div className="w-full md:w-1/4 bg-white h-[70vh] sticky top-16 rounded-xl shadow-sm border-[1px] border-gray-200 m-5">
      <div className="p-4">
        <button className="flex items-center text-gray-700 hover:text-gray-900" onClick={()=> navigate("/")}>
          <IoArrowBack className="w-6 h-6" />
        </button>
      </div>
      <nav className="mt-2">
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
  );
}

export default SettingsSidebar;