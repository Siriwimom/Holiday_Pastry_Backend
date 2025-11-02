import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

// ✅ ประกาศ PORT ก่อนใช้งาน
const PORT = process.env.PORT || 5000;

// ✅ ตั้งค่า CORS
app.use(cors({
  origin: "https://siriwimom.github.io/Holiday_Pastry",
  credentials: true
}));

app.use(express.json());

// ✅ เชื่อมต่อ MongoDB ก่อนเริ่ม server
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ DB connection error:", err));

// ✅ Route เริ่มต้น (health check)
app.get("/", (req, res) => {
  res.send("Holiday Pastry API is running 🍰");
});

// ✅ เริ่มต้น server (ฟังก์ชันเดียว)
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
