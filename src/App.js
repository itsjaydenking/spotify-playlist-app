import React, { useState, useEffect } from "react";
import axios from "axios";
import { loginUrl } from "./auth";
import "./App.css";

function App() {
  const [token, setToken] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("track"); // Added search type
  const [tracks, setTracks] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);

  // Check if the user is authenticated
  useEffect(() => {
    // Clear any old token that may be stored
    window.localStorage.removeItem("token");
    const hash = window.location.hash; // Get the hash containing the access token
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      // Make sure the hash contains 'access_token' before processing
      const accessToken = hash
        .substring(1) // Remove the "#" character from the hash
        .split("&")
        .find((el) => el.startsWith("access_token"));

      if (accessToken) {
        token = accessToken.split("=")[1]; // Extract the actual token value
        window.localStorage.setItem("token", token);
        window.location.hash = ""; // Clear the hash after extracting the token
      }
    }

    setToken(token);
  }, []);

  // Logout and clear token
  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  // Fetch tracks from Spotify API
  const searchTracks = async () => {
    try {
      const { data } = await axios.get(`https://api.spotify.com/v1/search`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: searchTerm,
          type: searchBy, // Search by track, artist, album
        },
      });

      if (searchBy === "track") {
        setTracks(data.tracks.items);
      } else if (searchBy === "artist") {
        const artistId = data.artists.items[0].id;
        const artistTracks = await axios.get(
          `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTracks(artistTracks.data.tracks);
      } else if (searchBy === "album") {
        setTracks(data.albums.items);
      }
    } catch (error) {
      console.error("Error fetching data from Spotify API", error);
    }
  };

  // Create playlist and add tracks
  const createPlaylist = async () => {
    try {
      const user = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const playlist = await axios.post(
        `https://api.spotify.com/v1/users/${user.data.id}/playlists`,
        {
          name: "Custom Playlist",
          description: "Generated by Spotify Playlist App",
          public: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlist.data.id}/tracks`,
        {
          uris: selectedTracks,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Playlist created successfully!");
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
  };

  // Handle track selection for playlist
  const handleSelectTrack = (uri) => {
    setSelectedTracks((prevTracks) =>
      prevTracks.includes(uri)
        ? prevTracks.filter((trackUri) => trackUri !== uri)
        : [...prevTracks, uri]
    );
  };

  return (
    <div className="container">
      <h1>Spotify Playlist App</h1>

      {!token ? (
        <a href={loginUrl}>Login to Spotify</a>
      ) : (
        <div>
          <button className="logout" onClick={logout}>
            Logout
          </button>

          <div className="search-bar">
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
            >
              <option value="track">Track</option>
              <option value="artist">Artist</option>
              <option value="album">Album</option>
            </select>

            <input
              type="text"
              placeholder={`Search for a ${searchBy}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={searchTracks}>Search</button>
          </div>

          <div className="track-container">
            {tracks.map((track) => (
              <div className="track" key={track.id}>
                <h3>{track.name}</h3>
                <p>
                  {track.artists && track.artists[0].name} -{" "}
                  {track.album && track.album.name}
                </p>
                <img
                  src={track.album.images[0].url}
                  alt="Album Cover"
                  style={{ width: "100px" }}
                />
                <button
                  className={`select-track ${
                    selectedTracks.includes(track.uri) ? "selected" : ""
                  }`}
                  onClick={() => handleSelectTrack(track.uri)}
                >
                  {selectedTracks.includes(track.uri) ? "Remove" : "Add"}
                </button>
              </div>
            ))}
          </div>

          {selectedTracks.length > 0 && (
            <button className="playlist" onClick={createPlaylist}>
              Export to Spotify
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
