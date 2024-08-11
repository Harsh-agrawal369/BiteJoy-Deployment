import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Attempting to import foodController from:", path.resolve(__dirname, '../controllers/foodController.js'));

import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();

// Image Storage Engine (Middleware)
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, callback) => {
    return callback(null, `${Date.now()}${file.originalname}`); // To make the filename unique
  },
});

const upload = multer({ storage });

// Get Requests
foodRouter.get("/list", listFood);

// Post Requests
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.post("/remove", removeFood);

export default foodRouter;
