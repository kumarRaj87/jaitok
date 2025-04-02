import React, { useState, useEffect } from 'react';
import { Home, Compass, Upload, User, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const MobileBottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('/');
    const [showUploadAnimation, setShowUploadAnimation] = useState(false);

    useEffect(() => {
        setActiveTab(location.pathname);
    }, [location]);

    const handleNavigation = (path) => {
        if (path === '/upload') {
            setShowUploadAnimation(true);
            setTimeout(() => {
                setShowUploadAnimation(false);
                navigate(path);
            }, 700);
        } else {
            navigate(path);
        }
    };

    const navItems = [
        { icon: Home, label: 'Home', path: '/foryou' },
        { icon: Compass, label: 'Explore', path: '/explore' },
        { icon: null, label: 'Upload', path: '/upload' },
        { icon: User, label: 'Profile', path: '/profile' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const isActive = (path) => {
        if (path === '/foryou' && (activeTab === '/foryou' || activeTab === '/')) return true;
        return activeTab === path;
    };

    return (
        <>
            <AnimatePresence>
                {showUploadAnimation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring", duration: 0.6 }}
                            className="bg-white rounded-full p-6"
                        >
                            <Upload size={48} className="text-pink-500" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="h-16 sm:hidden"> {/* Spacer for content */}</div>

            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', damping: 20 }}
                className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around z-40 sm:hidden"
            >
                {navItems.map((item, index) => (
                    <div key={index} className="flex-1 h-full flex flex-col items-center justify-center">
                        {index === 2 ? (
                            <div className="relative -mt-8">
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center shadow-lg relative z-10"
                                    onClick={() => handleNavigation(item.path)}
                                >
                                    <Upload size={24} className="text-white" />

                                    <motion.div
                                        initial={{ scale: 1 }}
                                        animate={{
                                            scale: [1, 1.1, 1],
                                        }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 2,
                                            ease: "easeInOut"
                                        }}
                                        className="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-30 blur-sm z-0"
                                    />
                                </motion.button>
                                <p className="text-[10px] mt-1 text-center font-medium">{item.label}</p>
                            </div>
                        ) : (
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                className={`flex flex-col items-center justify-center h-full w-full pt-1 ${isActive(item.path) ? 'text-pink-500' : 'text-gray-500'
                                    }`}
                                onClick={() => handleNavigation(item.path)}
                            >
                                <motion.div
                                    initial={false}
                                    animate={isActive(item.path) ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <item.icon size={22} />
                                </motion.div>
                                <motion.p
                                    className="text-[10px] mt-0.5 font-medium"
                                    initial={false}
                                    animate={isActive(item.path) ? { opacity: 1 } : { opacity: 0.7 }}
                                >
                                    {item.label}
                                </motion.p>
                                {isActive(item.path) && (
                                    <motion.div
                                        layoutId="activeTabIndicator"
                                        className="absolute bottom-0 w-8 h-0.5 bg-pink-500 rounded-full"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </motion.button>
                        )}
                    </div>
                ))}
            </motion.div>
        </>
    );
};

export default MobileBottomNav;