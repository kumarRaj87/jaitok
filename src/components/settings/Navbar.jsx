import { FiSearch, FiUpload } from 'react-icons/fi';
import { IoNotificationsOutline } from 'react-icons/io5';
import { BiMessageDetail } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate()
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="max-w-screen-2xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center">
          <img src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg" alt="TikTok" className="h-8 w-auto" onClick={()=> navigate("/")} />
        </div>
        
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <div className="flex items-center bg-gray-100 rounded-full">
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-transparent py-2.5 px-4 pl-4 focus:outline-none text-sm"
              />
              <div className="px-3 py-2 border-l border-gray-200">
                <FiSearch className="text-gray-400 w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 bg-[#F8F8F8] hover:bg-gray-100 px-4 py-2 rounded-md">
            <FiUpload className="text-xl" />
            <span className="text-sm font-medium">Upload</span>
          </button>
          <button className="text-2xl">
            <BiMessageDetail />
          </button>
          <button className="text-2xl">
            <IoNotificationsOutline />
          </button>
          <button className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
            K
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;