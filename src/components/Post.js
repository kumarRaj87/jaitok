import React, { useState } from 'react'
import { FaEllipsisH, FaHeart, FaComment, FaShare, FaBookmark } from "react-icons/fa";


const Post = ({ user, content, hashtags, image }) => {
    const [saved, setSaved] = useState(false);


    const toggleSave = () => {
        setSaved(!saved);
        alert(saved ? "Removed from favorites" : "Saved to favorites");
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md my-4 border-t-[1px] border-b-[1px]">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <img src="https://via.placeholder.com/40" alt="profile" className="w-10 h-10 rounded-full mr-2" />
                    <div>
                        <h3 className="font-semibold">{user}</h3>
                        <p className="text-sm text-gray-500">User description here</p>
                    </div>
                </div>
                <FaEllipsisH className="cursor-pointer" />
            </div>
            <p className="mb-2">{content}</p>
            <p className="text-blue-500 text-sm mb-2">{hashtags}</p>
            <img src={image} alt="post" className="w-full rounded-xl mb-2" />
            <div className="flex justify-between text-gray-600">
                {/* <FaHeart className="cursor-pointer" />
                <FaComment className="cursor-pointer" />
                <FaShare className="cursor-pointer" />
                <FaBookmark
                    className={`cursor-pointer ${saved ? "text-orange-500" : ""}`}
                    onClick={toggleSave}
                /> */}
            </div>
        </div>
    );
};

export default Post