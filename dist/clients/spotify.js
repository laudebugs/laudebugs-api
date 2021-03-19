"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Spotify = require("node-spotify-api");
const spotifyClient = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET,
});
exports.default = spotifyClient;
//# sourceMappingURL=spotify.js.map