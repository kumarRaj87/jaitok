import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MainContent from './MainContent';
import TopNavigation from './Header';
import { FiRadio } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

const Live = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("For You");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get('https://jaitok-api.jaitia.com/query/stream', {
          headers: {
            'Accept': 'application/json',
            'access-token': authToken,
          }
        });

        const liveStreams = response.data.data.streams.filter(stream => stream.isLive);
        setStreams(liveStreams);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch streams');
        setLoading(false);
      }
    };

    fetchStreams();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  const transformedStreams = streams.map(stream => ({
    id: stream.id,
    title: stream.title || 'Untitled Stream',
    username: `${stream.host.firstName} ${stream.host.lastName}`,
    viewers: stream.viewersCount,
    category: 'Gaming',
    thumbnail: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
  }));

  if (transformedStreams.length === 0) {
    return (
      <div className="h-screen flex flex-col lg:pl-72 pl-0 overflow-hidden w-full">
        <TopNavigation activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        <div className="flex items-center lg:mt-20 mt-5 w-full justify-end pr-6">
          <button
            onClick={() => navigate('/live-stream')}
            className="gap-2 flex justify-center items-center bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transition duration-200"
          >
            <Plus size={24} className=' text-white' />Create Live
          </button>
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          <FiRadio className="text-6xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600">No streams available</h2>
          <p className="text-gray-500 mt-2">There are currently no live streams. Check back later!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col lg:pl-72 pl-0 overflow-hidden w-full">
      <TopNavigation activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <div className="flex items-center lg:mt-20 mt-5 w-full justify-end pr-6">
        <button
          onClick={() => navigate('/live-stream')}
          className="gap-2 flex justify-center items-center bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transition duration-200"
        >
          <Plus size={24} className=' text-white' />Create Live
        </button>
      </div>
      <div className="flex w-full overflow-y-auto h-[100vh]">
        <MainContent liveStreams={transformedStreams} />
      </div>
    </div>
  );
};

export default Live;