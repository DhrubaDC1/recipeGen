import "./App.css";

async function getRecipe() {
  const response = await fetch("http://localhost:3000/api/recipe");
  const data = await response.json();
  console.log(data.recipe);
}

function App() {
  return (
    <>
      <div>
        <h1>Recipe Generator</h1>
        <button onClick={getRecipe}>Generate Recipe</button>
      </div>
    </>
  );
}

export default App;
