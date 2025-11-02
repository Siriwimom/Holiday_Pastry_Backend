import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// ✅ Routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/cart.js";
import purchasesRoutes from "./routes/purchases.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "x-user-id"],
  })
);
app.options("*", cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ✅ Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/purchases", purchasesRoutes);

// ✅ Root route
app.get("/", (_req, res) => res.json({ ok: true }));

// ✅ Connect MongoDB
const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

async function start() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connect failed:", err.message);
    process.exit(1);
  }
}

start();
