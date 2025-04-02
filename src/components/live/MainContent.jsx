import React, { useState } from 'react';
import JoinStream from './JoinStream';
import LiveStreamCard from './LiveStreamCard';

export default function MainContent({ liveStreams }) {
    const [activeStream, setActiveStream] = useState(null)

    return (
        <>
            {
                activeStream ? <JoinStream streamId={activeStream.id} channelName={activeStream.title} setActiveStream={setActiveStream} /> :
                    <div className="flex-1 p-6 overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Gaming</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {liveStreams.map(stream => (
                                <LiveStreamCard key={stream.id} stream={stream} setActiveStream={setActiveStream} />
                            ))}
                        </div>
                    </div>
            }
        </>
    );
}