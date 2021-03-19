const Spotify = require("node-spotify-api");

const spotifyClient = new Spotify({
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET,
});

export default spotifyClient;
