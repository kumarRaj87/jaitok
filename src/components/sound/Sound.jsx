// import { useState } from 'react';
// import { BsChevronLeft, BsChevronRight, BsBookmark } from 'react-icons/bs';
// import { AiOutlineSearch } from 'react-icons/ai';
// import { useLanguage } from '../../context/LanguageContext';

// function SoundLibrary() {
    
//     const { t } = useLanguage();
//     console.log(t);
    
//     const [currentPage, setCurrentPage] = useState(1);
//     const totalPages = 2;

//     const playlists = [
//         {
//             id: 1,
//             titleKey: "trending",
//             image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=300&fit=crop"
//         },
//         {
//             id: 2,
//             titleKey: "popMusic",
//             image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=300&fit=crop"
//         },
//         {
//             id: 3,
//             titleKey: "vlog",
//             image: "https://images.unsplash.com/photo-1436891620584-47fd0e565afb?w=500&h=300&fit=crop"
//         },
//         {
//             id: 4,
//             titleKey: "lightMusic",
//             image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500&h=300&fit=crop"
//         }
//     ];

//     const sounds = [
//         {
//             id: 1,
//             title: "Future",
//             artist: "Official Sound Studio",
//             theme: "Spring",
//             style: "Easy Listening",
//             duration: "00:33",
//             language: "non_vocal",
//             image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=50&h=50&fit=crop"
//         },
//         {
//             id: 2,
//             title: "Sunrise",
//             artist: "Official Sound Studio",
//             theme: "Dance",
//             style: "Electronic",
//             duration: "00:31",
//             language: "non_vocal",
//             image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=50&h=50&fit=crop"
//         },
//         {
//             id: 3,
//             title: "Countless",
//             artist: "Official Sound Studio",
//             theme: "Vlog, Summer",
//             style: "Hip Hop/Rap",
//             duration: "01:15",
//             language: "non_vocal",
//             image: "https://images.unsplash.com/photo-1436891620584-47fd0e565afb?w=50&h=50&fit=crop"
//         }
//     ];

//     return (
//         <div className="py-10 pl-[20rem] pr-8">
//             <div className="mb-8">
//                 <h1 className="text-2xl font-bold mb-2">{t('soundLibraryTitle')}</h1>
//                 <p className="text-gray-600">
//                     {t('soundLibraryDescription')}{" "}
//                     <a href="#" className="text-[#FE2C55]">{t('howToUse')}</a>
//                 </p>
//             </div>

//             <div className="mb-12">
//                 <div className="flex items-center justify-between mb-4">
//                     <h2 className="text-xl font-semibold">{t('playlists')}</h2>
//                     <div className="flex items-center space-x-2">
//                         <span className="text-gray-500">{currentPage}/{totalPages}</span>
//                         <button
//                             className="p-2 hover:bg-gray-100 rounded-full"
//                             onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                         >
//                             <BsChevronLeft size={20} />
//                         </button>
//                         <button
//                             className="p-2 hover:bg-gray-100 rounded-full"
//                             onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//                         >
//                             <BsChevronRight size={20} />
//                         </button>
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-4 gap-4">
//                     {playlists.map(playlist => (
//                         <div key={playlist.id} className="relative group cursor-pointer">
//                             <img
//                                 src={playlist.image}
//                                 alt={t(playlist.titleKey)}
//                                 className="w-full h-48 object-cover rounded-lg"
//                             />
//                             <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
//                                 <h3 className="text-white text-xl font-semibold">{t(playlist.titleKey)}</h3>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             <div>
//                 <h2 className="text-xl font-semibold mb-4">{t('library')}</h2>

//                 <div className="flex items-center space-x-4 mb-6">
//                     <div className="relative">
//                         <select className="pl-4 pr-8 py-2 bg-gray-100 rounded-full appearance-none focus:outline-none">
//                             <option>{t('theme')}</option>
//                         </select>
//                     </div>
//                     <div className="relative">
//                         <select className="pl-4 pr-8 py-2 bg-gray-100 rounded-full appearance-none focus:outline-none">
//                             <option>{t('style')}</option>
//                         </select>
//                     </div>
//                     <div className="relative">
//                         <select className="pl-4 pr-8 py-2 bg-gray-100 rounded-full appearance-none focus:outline-none">
//                             <option>{t('duration')}</option>
//                         </select>
//                     </div>
//                     <div className="relative">
//                         <select className="pl-4 pr-8 py-2 bg-gray-100 rounded-full appearance-none focus:outline-none">
//                             <option>{t('sortByHot')}</option>
//                         </select>
//                     </div>
//                     <div className="relative flex-1">
//                         <input
//                             type="text"
//                             placeholder={t('searchPlaceholder')}
//                             className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none"
//                         />
//                         <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                     </div>
//                 </div>

//                 <table className="w-full">
//                     <thead>
//                         <tr className="border-b">
//                             <th className="text-left py-4 font-medium text-gray-500">{t('soundColumn')}</th>
//                             <th className="text-left py-4 font-medium text-gray-500">{t('themeColumn')}</th>
//                             <th className="text-left py-4 font-medium text-gray-500">{t('styleColumn')}</th>
//                             <th className="text-left py-4 font-medium text-gray-500">{t('durationColumn')}</th>
//                             <th className="text-left py-4 font-medium text-gray-500">{t('languageColumn')}</th>
//                             <th className="text-left py-4 font-medium text-gray-500">{t('actionColumn')}</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {sounds.map(sound => (
//                             <tr key={sound.id} className="border-b hover:bg-gray-50">
//                                 <td className="py-4">
//                                     <div className="flex items-center space-x-3">
//                                         <img src={sound.image} alt={sound.title} className="w-10 h-10 rounded" />
//                                         <div>
//                                             <h4 className="font-medium">{sound.title}</h4>
//                                             <p className="text-sm text-gray-500">{sound.artist}</p>
//                                         </div>
//                                     </div>
//                                 </td>
//                                 <td className="py-4">{sound.theme}</td>
//                                 <td className="py-4">{sound.style}</td>
//                                 <td className="py-4">{sound.duration}</td>
//                                 <td className="py-4">{sound.language}</td>
//                                 <td className="py-4">
//                                     <button className="p-2 hover:bg-gray-100 rounded-full">
//                                         <BsBookmark size={20} />
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }

// export default SoundLibrary;


import { useState } from 'react';
import { BsChevronLeft, BsChevronRight, BsBookmark } from 'react-icons/bs';
import { AiOutlineSearch } from 'react-icons/ai';
import { useLanguage } from '../../context/LanguageContext';

function SoundLibrary() {
    const { t } = useLanguage();
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 2;

    const playlists = [
        {
            id: 1,
            titleKey: "trending",
            image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=300&fit=crop"
        },
        {
            id: 2,
            titleKey: "popMusic",
            image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=300&fit=crop"
        },
        {
            id: 3,
            titleKey: "vlog",
            image: "https://images.unsplash.com/photo-1436891620584-47fd0e565afb?w=500&h=300&fit=crop"
        },
        {
            id: 4,
            titleKey: "lightMusic",
            image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500&h=300&fit=crop"
        }
    ];

    const sounds = [
        {
            id: 1,
            title: "Future",
            artist: "Official Sound Studio",
            theme: "Spring",
            style: "Easy Listening",
            duration: "00:33",
            language: "non_vocal",
            image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=50&h=50&fit=crop"
        },
        {
            id: 2,
            title: "Sunrise",
            artist: "Official Sound Studio",
            theme: "Dance",
            style: "Electronic",
            duration: "00:31",
            language: "non_vocal",
            image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=50&h=50&fit=crop"
        },
        {
            id: 3,
            title: "Countless",
            artist: "Official Sound Studio",
            theme: "Vlog, Summer",
            style: "Hip Hop/Rap",
            duration: "01:15",
            language: "non_vocal",
            image: "https://images.unsplash.com/photo-1436891620584-47fd0e565afb?w=50&h=50&fit=crop"
        }
    ];

    return (
        <div className="py-6 md:py-10 pl-4 sm:pl-8 lg:pl-[20rem] pr-4 sm:pr-8">
            {/* Header Section */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-xl sm:text-2xl font-bold mb-2">{t('soundLibraryTitle')}</h1>
                <p className="text-sm sm:text-base text-gray-600">
                    {t('soundLibraryDescription')}{" "}
                    <a href="#" className="text-[#FE2C55] hover:underline">{t('howToUse')}</a>
                </p>
            </div>

            {/* Playlists Section */}
            <div className="mb-8 md:mb-12">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                    <h2 className="text-lg sm:text-xl font-semibold">{t('playlists')}</h2>
                    <div className="flex items-center space-x-2 self-end sm:self-auto">
                        <span className="text-sm sm:text-base text-gray-500">{currentPage}/{totalPages}</span>
                        <button
                            className="p-1 sm:p-2 hover:bg-gray-100 rounded-full"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            aria-label="Previous page"
                        >
                            <BsChevronLeft size={18} />
                        </button>
                        <button
                            className="p-1 sm:p-2 hover:bg-gray-100 rounded-full"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            aria-label="Next page"
                        >
                            <BsChevronRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {playlists.map(playlist => (
                        <div key={playlist.id} className="relative group cursor-pointer">
                            <img
                                src={playlist.image}
                                alt={t(playlist.titleKey)}
                                className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
                                <h3 className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-semibold px-2 text-center">
                                    {t(playlist.titleKey)}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Library Section */}
            <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-4">{t('library')}</h2>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 md:space-x-4 mb-6">
                    <div className="relative w-full sm:w-auto">
                        <select className="w-full sm:w-32 md:w-40 pl-4 pr-8 py-2 text-sm bg-gray-100 rounded-full appearance-none focus:outline-none">
                            <option>{t('theme')}</option>
                        </select>
                    </div>
                    <div className="relative w-full sm:w-auto">
                        <select className="w-full sm:w-32 md:w-40 pl-4 pr-8 py-2 text-sm bg-gray-100 rounded-full appearance-none focus:outline-none">
                            <option>{t('style')}</option>
                        </select>
                    </div>
                    <div className="relative w-full sm:w-auto">
                        <select className="w-full sm:w-32 md:w-40 pl-4 pr-8 py-2 text-sm bg-gray-100 rounded-full appearance-none focus:outline-none">
                            <option>{t('duration')}</option>
                        </select>
                    </div>
                    <div className="relative w-full sm:w-auto">
                        <select className="w-full sm:w-32 md:w-40 pl-4 pr-8 py-2 text-sm bg-gray-100 rounded-full appearance-none focus:outline-none">
                            <option>{t('sortByHot')}</option>
                        </select>
                    </div>
                    <div className="relative w-full sm:flex-1">
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            className="w-full text-sm pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none"
                        />
                        <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>

                {/* Sounds Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-500">{t('soundColumn')}</th>
                                <th className="text-left py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-500">{t('themeColumn')}</th>
                                <th className="text-left py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-500">{t('styleColumn')}</th>
                                <th className="text-left py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-500">{t('durationColumn')}</th>
                                <th className="text-left py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-500">{t('languageColumn')}</th>
                                <th className="text-left py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-500">{t('actionColumn')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sounds.map(sound => (
                                <tr key={sound.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 sm:py-4">
                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                            <img 
                                                src={sound.image} 
                                                alt={sound.title} 
                                                className="w-8 h-8 sm:w-10 sm:h-10 rounded" 
                                                loading="lazy"
                                            />
                                            <div>
                                                <h4 className="text-xs sm:text-sm font-medium">{sound.title}</h4>
                                                <p className="text-xs text-gray-500">{sound.artist}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 sm:py-4 text-xs sm:text-sm">{sound.theme}</td>
                                    <td className="py-3 sm:py-4 text-xs sm:text-sm">{sound.style}</td>
                                    <td className="py-3 sm:py-4 text-xs sm:text-sm">{sound.duration}</td>
                                    <td className="py-3 sm:py-4 text-xs sm:text-sm">{sound.language}</td>
                                    <td className="py-3 sm:py-4">
                                        <button 
                                            className="p-1 sm:p-2 hover:bg-gray-100 rounded-full"
                                            aria-label="Bookmark"
                                        >
                                            <BsBookmark size={16} className="sm:w-5 sm:h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default SoundLibrary;