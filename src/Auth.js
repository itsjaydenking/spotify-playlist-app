const CLIENT_ID = "c94106fb38c648399c3f429b9a931755"; // Your Spotify Client ID
const REDIRECT_URI = "https://itsjaydenking.github.io/spotify-playlist-app/"; // GitHub Pages URL
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
//${REDIRECT_URI}
export const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=https://itsjaydenking.github.io/spotify-playlist-app/&response_type=${RESPONSE_TYPE}&scope=playlist-modify-public`;
