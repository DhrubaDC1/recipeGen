import React, { useState } from "react";
import "./App.css";
function removeBackticksAndParse(str) {
  let recipe = JSON.parse(str.replace(/^```json|```$/g, "").trim());
  return recipe;
}

function App() {
  const [recipe, setRecipe] = useState("Loading...");
  const [image, setImage] = useState(null);
  async function getRecipe(image) {
    console.log("🚀 ~ getRecipe ~ image:", image);
    const formData = new FormData();
    formData.append("image", image);

    setRecipe("Loading...");
    const response = await fetch("http://localhost:3000/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    const recipe = removeBackticksAndParse(data.recipe);

    console.log("🚀 ~ getRecipe ~ recipe:", recipe);
    setRecipe(recipe);
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
    getRecipe(file);
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
        getRecipe(blob);
        stream.getTracks().forEach((track) => track.stop());
      }, "image/png");
    });
  };

  return (
    <>
      <div style={{ textAlign: "start" }}>
        <div>
          {recipe !== "Loading..." ? (
            <div>
              {image && (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Uploaded"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              )}
              <h2>Recipe for {recipe?.recipe_name}</h2>
              <h2>Image Description</h2>
              <p>{recipe?.image_description}</p>
              <h2>Ingredients</h2>
              <ul>
                {recipe?.ingredients.map((ingredient) => (
                  <li key={ingredient.item_name}>
                    {ingredient.item_name} - {ingredient.quantity}
                  </li>
                ))}
              </ul>
              <h2>Instructions</h2>
              <ol>
                {recipe?.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
              <h2>Nutrition</h2>
              <ul>
                {Object.entries(recipe?.nutrition_count).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value}
                  </li>
                ))}
              </ul>
              <div>
                <p>Upload Another Image</p>
                <input
                  type="file"
                  accept="image/*"
                  placeholder="Upload another image"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          ) : (
            <div>
              <h1>Recipe Generator</h1>
              <div>
                <h2>Upload an image</h2>
                <input
                  type="file"
                  accept="image/*"
                  placeholder="Upload an image"
                  onChange={handleImageUpload}
                />
              </div>
              <p>No recipe available. Please upload an image.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
