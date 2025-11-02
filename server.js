// ===== server.js =====
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// ✅ โหลดไฟล์ .env
dotenv.config();

// ✅ import routes ทั้งหมด
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/cart.js";
import purchaseRoutes from "./routes/purchases.js"; // เผื่อมีไฟล์นี้ในอนาคต

// ✅ สร้าง express app
const app = express();

// ====== 🔒 CORS Setup ======
const allowedOrigins = [
  "https://siriwimom.github.io",
  "https://siriwimom.github.io/Holiday_Pastry",
  "http://localhost:5173", // สำหรับ dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed: " + origin));
      }
    },
    credentials: true,
  })
);

// ====== ⚙️ Middleware ======
app.use(express.json()); // อ่าน JSON body

// ====== 🌐 Routes ======
app.get("/", (req, res) => {
  res.send("🍰 Holiday Pastry API is running!");
});

// ✅ Auth routes (register/login/reset)
app.use("/api/auth", authRoutes);

// ✅ Products routes (CRUD สินค้า)
app.use("/api/products", productRoutes);

// ✅ Cart routes (ตะกร้าสินค้า)
app.use("/api/cart", cartRoutes);

// ✅ Purchases routes (การสั่งซื้อ)
app.use("/api/purchases", purchaseRoutes);

// ====== 🧠 Database Connect ======
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    // ====== 🚀 Start Server ======
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
