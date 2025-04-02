import VideoFeed from "./VideoFeed";
import Profile from "./profile/Profile";
import Explore from "./explore/Explore";
import Upload from "./upload/Upload";
import SoundLibrary from "./sound/Sound";
import Settings from "./settings/Settings";
import Live from "./live/Live";
import Following from "./following/Following";
import Friends from "./following/Friends";
import Chat from "./chat/chat";
import UserProfile from "./userProfile/UserProfile";
import LiveStream from "./live-stream/LiveStream/LiveStream";
import JoinStream from "./live/JoinStream";

const privateRoutes = [
  { path: "/", element: <VideoFeed /> },
  { path: "/foryou", element: <VideoFeed /> },
  { path: "/profile", element: <Profile /> },
  { path: "/explore", element: <Explore /> },
  { path: "/upload", element: <Upload /> },
  { path: "/settings", element: <Settings /> },
  { path: "/live", element: <Live /> },
  { path: "/sound-library", element: <SoundLibrary /> },
  { path: "/following", element: <Following /> },
  { path: "/friends", element: <Friends /> },
  { path: "/chat", element: <Chat /> },
  { path: "/user/:id", element: <UserProfile /> },
  { path: "/live-stream", element: <LiveStream /> },
  { path: "/join-stream", element: <JoinStream /> },
];

export default privateRoutes;
