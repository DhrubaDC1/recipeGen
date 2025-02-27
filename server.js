import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import getRecipe from "./src/getResponse.js";
import multer from "multer";

const app = express();
const port = 3000;

app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only image files are allowed."), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

app.post("/api/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded or invalid file type.");
  }
  const imageBuffer = req.file.buffer;
  const uploadPath = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  const fileName = `${Date.now()}-${req.file.originalname}`;
  const filePath = path.join(uploadPath, fileName);
  fs.writeFileSync(filePath, imageBuffer);
  const recipe = await getRecipe(filePath);
  res.json({ recipe });
});

app.get("/api/recipe", async (req, res) => {
  const imagePath = path.join(__dirname, "public", "image_croissant.jpeg");
  const recipe = await getRecipe(imagePath);
  res.json({ recipe });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "dist")));

// Handle client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
