import { AiOutlineHeart, AiOutlineComment, AiOutlineShareAlt } from 'react-icons/ai';

function VideoCard({ video }) {
  return (
    <div className="w-[350px] lg:w-[330px] h-[400px] lg:h-[470px] border border-gray-200 rounded-lg mb-4 flex flex-col justify-between items-start">
      <div className="p-4 h-[20%]">
        <div className="flex items-center space-x-2">
          <img
            src={video.userAvatar}
            alt={video.username}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-semibold">{video.username}</h3>
            <p className="text-sm text-gray-500">{video.description.length > 25 ? video.description.substring(0, 25) + "... more" : video.description}</p>
          </div>
          <button className="ml-auto px-4 py-1 text-[#FE2C55] border border-[#FE2C55] rounded-md">
            Follow
          </button>
        </div>
      </div>
      
      <div className="relative h-[65%] w-full justify-center flex items-center">
        <img
          src={video.thumbnail}
          alt={video.description}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4 h-[15%]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="flex flex-col items-center">
              <AiOutlineHeart size={24} />
              <span className="text-xs">{video.likes}</span>
            </button>
            <button className="flex flex-col items-center">
              <AiOutlineComment size={24} />
              <span className="text-xs">{video.comments}</span>
            </button>
            <button className="flex flex-col items-center">
              <AiOutlineShareAlt size={24} />
              <span className="text-xs">{video.shares}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;