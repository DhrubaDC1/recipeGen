import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import getRecipe from "./src/getResponse.js";

const app = express();
const port = 3000;

app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/api/recipe", async (req, res) => {
  const imagePath = path.join(__dirname, "public", "image_croissant.jpeg");
  //   const image = fs.readFileSync(imagePath);
  // Process the image and generate a recipe
  const recipe = await getRecipe(imagePath);
  //   const recipe = "Generated Recipe"; // Replace with actual recipe generation logic
  res.json({ recipe });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
