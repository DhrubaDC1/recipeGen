import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import getRecipe from "./src/getResponse.js";
import multer from "multer";
import heicConvert from "heic-convert";

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
    "image/heic",
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
  const uploadPath = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  let fileName = `${Date.now()}-${req.file.originalname}`;
  let filePath = path.join(uploadPath, fileName);

  if (req.file.mimetype === "image/heic") {
    fileName = `${Date.now()}-${req.file.originalname.split(".")[0]}.jpeg`;
    filePath = path.join(uploadPath, fileName);
    const outputBuffer = await heicConvert({
      buffer: req.file.buffer,
      format: "JPEG",
      quality: 1,
    });
    fs.writeFileSync(filePath, outputBuffer);
  } else {
    fs.writeFileSync(filePath, req.file.buffer);
  }

  const recipe = await getRecipe(filePath);
  res.json({ recipe, fileName });
});

app.get("/api/recipe", async (req, res) => {
  const imagePath = path.join(__dirname, "public", "image_croissant.jpeg");
  const recipe = await getRecipe(imagePath);
  res.json({ recipe });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "dist")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Handle client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
