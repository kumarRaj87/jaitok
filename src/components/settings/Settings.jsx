import { useRef } from 'react';
import Navbar from './Navbar';
import SettingsSidebar from './SettingsSidebar';
import MainContent from './MainContent';

function Settings() {
    const mainContentRef = useRef(null);

    const handleMenuClick = (sectionId) => {
        const section = mainContentRef.current.querySelector(`#${sectionId}`);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="h-screen bg-gray-100 text-black overflow-hidden">
            <Navbar />
            <div className="pt-16 h-full pb-6">
                <div className="w-[80%] mx-auto justify-center flex items-center">
                    <div className="flex flex-col md:flex-row">
                        <SettingsSidebar onMenuClick={handleMenuClick} />
                        <div ref={mainContentRef} className="flex-1">
                            <MainContent />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;