import React, { useState } from "react";
import "./App.css";

function removeBackticksAndParse(str) {
  let recipe = JSON.parse(str.replace(/^```json|```$/g, "").trim());
  return recipe;
}

function App() {
  const [recipe, setRecipe] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function getRecipe(image) {
    const formData = new FormData();
    formData.append("image", image);
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      const recipe = removeBackticksAndParse(data.recipe);
      setRecipe(recipe);
    } catch (error) {
      console.error("Error fetching recipe:", error);
    } finally {
      setIsLoading(false);
    }
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
    <div className="app-container">
      <h1 className="header">Recipe Generator</h1>
      <div className="upload-section">
        <label className="upload-button">
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </label>
      </div>
      {isLoading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Generating recipe...</p>
        </div>
      ) : recipe ? (
        <div className="recipe-details">
          <img
            src={URL.createObjectURL(image)}
            alt="Uploaded"
            className="recipe-image"
          />
          <h2 className="recipe-name">{recipe.recipe_name}</h2>
          <h3 className="section-heading">Image Description</h3>
          <p className="description">{recipe.image_description}</p>
          <h3 className="section-heading">Ingredients</h3>
          <ul className="ingredients-list">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.item_name} - {ingredient.quantity}
              </li>
            ))}
          </ul>
          <h3 className="section-heading">Instructions</h3>
          <ol className="instructions-list">
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
          <h3 className="section-heading">Nutrition</h3>
          <div className="nutrition-grid">
            {Object.entries(recipe.nutrition_count).map(([key, value]) => (
              <div key={key} className="nutrition-item">
                <span>{key}:</span>
                <br />
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="no-recipe">
          No recipe available. Please upload an image.
        </p>
      )}
    </div>
  );
}

export default App;
