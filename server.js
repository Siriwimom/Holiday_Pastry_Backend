import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js"; // ✅ สำคัญ ต้องมี .js ถ้าใช้ ESM

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS: อนุญาตให้เว็บจาก GitHub Pages เรียก API ได้
app.use(
  cors({
    origin: "https://siriwimom.github.io/Holiday_Pastry",
    credentials: true,
  })
);

app.use(express.json());

// ✅ เชื่อมต่อ MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB connection error:", err));

// ✅ ใช้งาน route auth ทั้งหมด
app.use("/api/auth", authRoutes);

// ✅ health check route
app.get("/", (req, res) => {
  res.send("Holiday Pastry API is running 🍰");
});

// ✅ start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
