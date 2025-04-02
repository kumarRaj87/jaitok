import React from 'react'
import { Play, Users, Heart, MessageCircle, Bookmark as BookmarkSimple } from 'lucide-react';
const LiveStreamCard = ({ stream, setActiveStream }) => {
    return (
        <div className="relative group cursor-pointer">
            <div className="aspect-video rounded-lg overflow-hidden relative">
                <img
                    src={stream.thumbnail}
                    alt={stream.title}
                    className="w-full h-full object-cover group-hover:blur-sm transition-all duration-300"
                />

                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 z-10">
                    <Play className="w-3 h-3 fill-current" /> LIVE
                </div>
                <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 z-10">
                    <Users className="w-3 h-3" /> {stream.viewers}
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveStream(stream);
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-medium flex items-center gap-2 shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                    >
                        <Play className="w-4 h-4 fill-current" />
                        Join Live
                    </button>
                </div>
            </div>

            <div className="mt-2 flex gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div>
                    <h3 className="font-semibold text-sm">{stream.title}</h3>
                    <p className="text-sm text-gray-500">@{stream.username}</p>
                </div>
            </div>

            <div className="absolute bottom-14 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                    <Heart className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                    <BookmarkSimple className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}

export default LiveStreamCard