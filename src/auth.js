const CLIENT_ID = "c94106fb38c648399c3f429b9a931755";
const REDIRECT_URI = "http://localhost:3000"; // Adjust based on your deployed URL
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";

export const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=playlist-modify-public`;
