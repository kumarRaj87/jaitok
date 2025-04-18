import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MainContent() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('authToken');
    const fetchSettings = async () => {
        try {
            const response = await axios.get('https://jaitok-api.jaitia.com/query/settings', {
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'access-token': token,
                },
            });
            setSettings(response.data.data[0]);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="flex flex-col h-[80vh] w-full bg-white text-[#161823] rounded-xl border-[1px] border-gray-200 my-5 overflow-y-auto" id="settings">
            <div className="w-full mx-auto pt-2 px-6 pb-4">
                <section id="manage-account" className="pt-4">
                    <h1 className="text-2xl font-bold mb-8">Manage account</h1>

                    <div className="mb-8">
                        <h2 className="text-[17px] font-semibold mb-4">Account control</h2>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                            <span>Delete account</span>
                            <button className="text-[#FE2C55] hover:underline">Delete</button>
                        </div>
                    </div>

                    <div className="mb-2">
                        <h2 className="text-[17px] font-semibold mb-4">Account information</h2>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                            <div>
                                <p className="font-medium">Account region</p>
                                <p className="text-sm text-gray-500 mt-1">Your account region is initially set based on the time and place of registration.</p>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <span>Germany</span>
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="privacy" className="pt-4">
                    <h2 className="text-2xl font-bold mb-8">Privacy</h2>
                    <div className="mb-2">
                        <h3 className="text-[17px] font-semibold mb-4">Discoverability</h3>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                            <div>
                                <p className="font-medium">Private account</p>
                                <p className="text-sm text-gray-500 mt-1">With a private account, only users you approve can follow you and watch your videos. Your existing followers won't be affected.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={settings.privacySettings.profileVisibility === 'private'} onChange={() => { }} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00DC8C]"></div>
                            </label>
                        </div>
                    </div>
                </section>

                <section id="notifications" className="pt-4">
                    <h2 className="text-2xl font-bold mb-8">Push notifications</h2>
                    <div className="mb-8">
                        <h3 className="text-[17px] font-semibold mb-4">Desktop notifications</h3>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                            <div>
                                <p className="font-medium">Allow in browser</p>
                                <p className="text-sm text-gray-500 mt-1">Stay on top of notifications for likes, comments, the latest videos, and more on desktop. You can turn them off anytime.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={settings.notificationSettings.directMessages} onChange={() => { }} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00DC8C]"></div>
                            </label>
                        </div>
                    </div>

                    <div className="mb-2">
                        <h3 className="text-[17px] font-semibold mb-4">Your preferences</h3>
                        <p className="text-sm text-gray-500 mb-4">Your preferences will be synced automatically to the TikTok app.</p>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                                <span>Likes</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={settings.notificationSettings.likes} onChange={() => { }} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00DC8C]"></div>
                                </label>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                                <span>Comments</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={settings.notificationSettings.comments} onChange={() => { }} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00DC8C]"></div>
                                </label>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                                <span>New followers</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={settings.notificationSettings.follows} onChange={() => { }} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00DC8C]"></div>
                                </label>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                                <span>Mentions and tags</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={settings.notificationSettings.mentions} onChange={() => { }} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00DC8C]"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default MainContent;