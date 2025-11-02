// server.js
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

// ✅ import route ต่าง ๆ
import authRoutes from "./routes/auth.js";  // <-- ต้องเพิ่มบรรทัดนี้

dotenv.config();
const app = express();

const allowedOrigins = [
  "https://siriwimom.github.io",
  "https://siriwimom.github.io/Holiday_Pastry",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// ✅ mount route /api/auth
app.use("/api/auth", authRoutes); // <-- บรรทัดสำคัญสุด

app.get("/", (req, res) => {
  res.send("Holiday Pastry API is running 🍰");
});

// ✅ เชื่อม MongoDB และ start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
