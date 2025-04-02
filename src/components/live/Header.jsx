import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useState, useRef, useEffect } from "react";

function TopNavigation({ activeCategory, setActiveCategory }) {
    const categories = [
        'For You',
        'Following',
        'Gaming',
        'Lifestyle',
        'PUBG Mobile',
        'Mobile Legends: Bang Bang',
        'Garena Free Fire',
        'Grand Theft Auto V',
        'Roblox',
        'Fortnite',
        'Minecraft',
        'Call of Duty: Mobile',
        'League of Legends'
    ];

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const scrollContainerRef = useRef(null);

    const checkScrollPosition = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
        }
    };

    const handleScroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200;
            scrollContainerRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
            setTimeout(checkScrollPosition, 300);
        }
    };


    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", checkScrollPosition);
            checkScrollPosition();
        }
        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener("scroll", checkScrollPosition);
            }
        };
    }, []);

    return (
        <div className="fixed top-0 left-64 right-0 bg-white z-10 flex items-center px-4 py-4">

            {canScrollLeft && (
                <button
                    onClick={() => handleScroll("left")}
                    className="p-2 text-gray-600 hover:bg-gray-200 rounded-full shadow-md"
                >
                    <AiOutlineLeft size={14} />
                </button>
            )}


            <div
                ref={scrollContainerRef}
                className="flex items-center space-x-4 overflow-hidden scroll-smooth w-full px-2"
            >
                {categories.map((category, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-1 text-sm whitespace-nowrap rounded-md transition ${activeCategory === category ? "bg-black text-white" : "bg-gray-100 text-black"
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {canScrollRight && (
                <button
                    onClick={() => handleScroll("right")}
                    className="p-2 text-gray-600 hover:bg-gray-200 rounded-full shadow-md"
                >
                    <AiOutlineRight size={14} />
                </button>
            )}
        </div>
    );
}

export default TopNavigation;
