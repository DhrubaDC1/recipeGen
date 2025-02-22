import React, { useState } from "react";
import "./App.css";
import MarkdownRenderer from "./MarkdownRenderer";

async function getRecipe(image, setRecipe) {
  console.log("🚀 ~ getRecipe ~ image:", image);
  const formData = new FormData();
  formData.append("image", image);

  setRecipe("Loading...");
  const response = await fetch(
    "https://e1d0-45-248-149-210.ngrok-free.app/api/upload",
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await response.json();
  setRecipe(data.recipe);
}

function App() {
  const [recipe, setRecipe] = useState("");
  const [image, setImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
    getRecipe(file, setRecipe);
  };

  const handleTakePhoto = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.createElement("video");
    video.srcObject = stream;
    video.play();

    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const context = canvas.getContext("2d");

    video.addEventListener("canplay", () => {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        setImage(blob);
        getRecipe(blob, setRecipe);
        stream.getTracks().forEach((track) => track.stop());
      }, "image/png");
    });
  };

  return (
    <>
      <div>
        <h1>Recipe Generator</h1>
        <div>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          <button onClick={handleTakePhoto}>Take Photo</button>
        </div>
        <div>
          {recipe ? (
            <MarkdownRenderer markdownContent={recipe} />
          ) : (
            "No recipe yet"
          )}
        </div>
      </div>
    </>
  );
}

export default App;
