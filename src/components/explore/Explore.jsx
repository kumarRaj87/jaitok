import { useState } from "react";
import TopNavigation from "./TopNavigation";
import VideoCard from "./VideoCard";

const Explore = () => {
    const [activeCategory, setActiveCategory] = useState("All");

    const videos = [
        {
            id: 1,
            username: "user123",
            userAvatar: "https://picsum.photos/50/50",
            description: "Check out this amazing video! #trending #viral",
            thumbnail: "https://picsum.photos/400/700",
            likes: "1.2M",
            comments: "10.5K",
            shares: "5.2K",
            category: "Sports"
        },
        {
            id: 2,
            username: "creator456",
            userAvatar: "https://picsum.photos/51/51",
            description: "Dancing to the latest trend 💃 #dance #fun",
            thumbnail: "https://picsum.photos/401/700",
            likes: "856K",
            comments: "6.3K",
            shares: "2.1K",
            category: "Singing & Dancing"
        },
        {
            id: 3,
            username: "tiktokstar",
            userAvatar: "https://picsum.photos/52/52",
            description: "New comedy skit! 😂 #funny #comedy",
            thumbnail: "https://picsum.photos/402/700",
            likes: "2.3M",
            comments: "15.7K",
            shares: "8.9K",
            category: "Comedy"
        },
        {
            id: 4,
            username: "beautyguru99",
            userAvatar: "https://picsum.photos/53/53",
            description: "My latest skincare routine 🌟 #BeautyCare",
            thumbnail: "https://picsum.photos/403/700",
            likes: "975K",
            comments: "8.4K",
            shares: "3.2K",
            category: "Beauty Care"
        },
        {
            id: 5,
            username: "animefanatic",
            userAvatar: "https://picsum.photos/54/54",
            description: "Top 10 anime battles of all time! 🔥 #Anime",
            thumbnail: "https://picsum.photos/404/700",
            likes: "1.5M",
            comments: "12.6K",
            shares: "6.5K",
            category: "Anime & Comics"
        },
        {
            id: 6,
            username: "relationshiptalks",
            userAvatar: "https://picsum.photos/55/55",
            description: "How to build a stronger relationship 💕 #RelationshipAdvice",
            thumbnail: "https://picsum.photos/405/700",
            likes: "643K",
            comments: "5.9K",
            shares: "1.8K",
            category: "Relationship"
        },
        {
            id: 7,
            username: "fashionqueen",
            userAvatar: "https://picsum.photos/56/56",
            description: "Latest outfit ideas for 2024! 👗✨ #OutfitInspo",
            thumbnail: "https://picsum.photos/406/700",
            likes: "1.1M",
            comments: "9.3K",
            shares: "4.7K",
            category: "Outfit"
        },
        {
            id: 8,
            username: "gamemaster",
            userAvatar: "https://picsum.photos/57/57",
            description: "Epic gaming moments you don't want to miss! 🎮🔥 #Gaming",
            thumbnail: "https://picsum.photos/407/700",
            likes: "2.8M",
            comments: "18.5K",
            shares: "9.4K",
            category: "Games"
        },
        {
            id: 9,
            username: "showtime",
            userAvatar: "https://picsum.photos/58/58",
            description: "Behind the scenes of the latest TV show! 📺 #Shows",
            thumbnail: "https://picsum.photos/408/700",
            likes: "889K",
            comments: "7.2K",
            shares: "3.6K",
            category: "Shows"
        },
        {
            id: 10,
            username: "dailylifevlogs",
            userAvatar: "https://picsum.photos/59/59",
            description: "A day in my life - come along with me! 🌟 #DailyLife",
            thumbnail: "https://picsum.photos/409/700",
            likes: "723K",
            comments: "6.8K",
            shares: "2.9K",
            category: "Daily Life"
        },
        {
            id: 11,
            username: "lipart",
            userAvatar: "https://picsum.photos/60/60",
            description: "Lipsyncing to my favorite songs! 🎤 #Lipsync",
            thumbnail: "https://picsum.photos/410/700",
            likes: "1.4M",
            comments: "11.4K",
            shares: "5.1K",
            category: "Lipsync"
        },
        {
            id: 12,
            username: "socialbuzz",
            userAvatar: "https://picsum.photos/61/61",
            description: "What's trending in society today? 🌍 #Society",
            thumbnail: "https://picsum.photos/411/700",
            likes: "624K",
            comments: "4.7K",
            shares: "2.1K",
            category: "Society"
        },
        {
            id: 13,
            username: "fitnessguru",
            userAvatar: "https://picsum.photos/62/62",
            description: "My morning workout routine 💪 #Fitness",
            thumbnail: "https://picsum.photos/412/700",
            likes: "2.1M",
            comments: "14.9K",
            shares: "7.8K",
            category: "Sports"
        }
    ];
    

    const filteredVideos = activeCategory === "All"
        ? videos
        : videos.filter((video) => video.category === activeCategory);

    return (
        <>
            <TopNavigation activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
            <div className="pt-16 lg:pt-20 pb-4 lg:pb-8 lg:pl-72 lg:pr-4">
                <div className="w-full p-2 gap-4 flex flex-wrap items-start justify-start">
                    {filteredVideos.length > 0 ? (
                        filteredVideos.map((video) => <VideoCard key={video.id} video={video} />)
                    ) : (
                        <p className="text-gray-500 text-center w-full">No videos found for "{activeCategory}"</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default Explore;
