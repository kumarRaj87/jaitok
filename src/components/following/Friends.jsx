import React from 'react';
import { 
  CheckCircle
} from 'lucide-react';

function Friends() {
  const suggestedAccounts = [
    { name: 'BTS', username: 'bts_official_bighit', verified: true, image: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=500', color: 'bg-purple-500' },
    { name: 'TWICE', username: 'twice_tiktok_official', verified: true, image: 'https://images.unsplash.com/photo-1619229667009-e7e51684e8e4?w=500', color: 'bg-red-500' },
    { name: 'WEST', username: 'wearewest7', verified: true, image: 'https://images.unsplash.com/photo-1619229661385-7c8b6981b7f3?w=500', color: 'bg-yellow-500' },
    { name: 'NiziU', username: 'niziu_official', verified: true, image: 'https://images.unsplash.com/photo-1619229661772-1d2e89135b5c?w=500', color: 'bg-pink-500' },
    { name: 'David Beckham', username: 'davidbeckham', verified: true, image: 'https://images.unsplash.com/photo-1619229661892-5cd2b1d6b809?w=500', color: 'bg-blue-500' },
    { name: 'Storm', username: 'hapimadanshi_storm', verified: false, image: 'https://images.unsplash.com/photo-1619229661973-7a1c5e0a8b3d?w=500', color: 'bg-green-500' },
    { name: 'BTS', username: 'bts_official_bighit', verified: true, image: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=500', color: 'bg-purple-500' },
    { name: 'TWICE', username: 'twice_tiktok_official', verified: true, image: 'https://images.unsplash.com/photo-1619229667009-e7e51684e8e4?w=500', color: 'bg-red-500' },
    { name: 'WEST', username: 'wearewest7', verified: true, image: 'https://images.unsplash.com/photo-1619229661385-7c8b6981b7f3?w=500', color: 'bg-yellow-500' },
    { name: 'NiziU', username: 'niziu_official', verified: true, image: 'https://images.unsplash.com/photo-1619229661772-1d2e89135b5c?w=500', color: 'bg-pink-500' },
    { name: 'David Beckham', username: 'davidbeckham', verified: true, image: 'https://images.unsplash.com/photo-1619229661892-5cd2b1d6b809?w=500', color: 'bg-blue-500' },
    { name: 'Storm', username: 'hapimadanshi_storm', verified: false, image: 'https://images.unsplash.com/photo-1619229661973-7a1c5e0a8b3d?w=500', color: 'bg-green-500' },
  ];

  return (
    <div className="flex min-h-screen bg-white lg:pl-64 pl-4 p-4">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
        <div className="mx-auto grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-6">
          {suggestedAccounts.map((account, index) => (
            <div 
              key={index} 
              className="relative group overflow-hidden rounded-lg aspect-[3/4] cursor-pointer w-full h-full min-h-[250px]"
            >
              <img
                src={account.image}
                alt={account.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60">
                <div className="absolute top-3 left-3">
                  <div className={`${account.color} w-10 h-10 rounded-full flex items-center justify-center`}>
                    <span className="text-white font-bold text-xs">
                      {account.name.split(' ')[0].charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center mb-1">
                    <h3 className="text-white font-bold text-sm md:text-base mr-1 truncate">
                      {account.name}
                    </h3>
                    {account.verified && (
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-500 fill-current flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-white/80 text-xs md:text-sm mb-2 truncate">@{account.username}</p>
                  <button className="w-full bg-[#FE2C55] text-white py-1.5 md:py-2 rounded text-sm md:text-base font-semibold hover:bg-[#e62a4f] transition-colors">
                    Follow
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Friends;