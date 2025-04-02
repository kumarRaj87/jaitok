// Your Agora App ID (replace with your actual App ID)
export const appId = "b7739d5ac03e45a5becb421d868c15d7";

// Token generation is recommended to be done on the server side
export const generateToken = (channelName) => {
  // In production, implement proper token generation on your server
  return null; // For testing, we'll use null which allows connection in testing mode
};

export const config = {
  mode: "live", // live streaming mode
  codec: "vp8", // video codec
  appId: appId,
  authentication: {
    token: null,
  },
};