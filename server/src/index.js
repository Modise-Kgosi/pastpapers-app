import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import papersRouter from "./routes/papers.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], // allow both frontend dev server ports
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/papers", papersRouter);
app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));