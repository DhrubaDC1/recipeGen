import React, { useState, useEffect } from "react";

const YouTubeVideo = ({ keyword }) => {
  const [videoId, setVideoId] = useState(null);
  const apiKey = "AIzaSyCQ0ijqIAj4OadkoWPB1BlPqLfPqj-oaUE"; // Replace with your YouTube Data API key

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${keyword}&type=video&key=${apiKey}&maxResults=1`
        );
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          setVideoId(data.items[0].id.videoId); // Set the first video's ID
        } else {
          console.error("No videos found for this keyword.");
        }
      } catch (error) {
        console.error("Error fetching YouTube video:", error);
      }
    };

    fetchVideo();
  }, [keyword, apiKey]); // Re-run when keyword or apiKey changes

  return (
    <div style={{ marginTop: "1rem" }}>
      {videoId ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allowFullScreen
          title="YouTube Video"
        ></iframe>
      ) : (
        <p>Loading video...</p>
      )}
    </div>
  );
};

export default YouTubeVideo;
