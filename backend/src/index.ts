import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import { routesController} from "./adapter/http/routesController";

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "FuelEU Maritime Backend API is running 🚢" });
});

app.use("/api/routes", routesController);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
