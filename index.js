// ===== index.js =====
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

// ===== Path setup =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ===== ✅ CORS setup (รองรับทั้ง localhost และ GitHub Pages) =====
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://siriwimom.github.io",                // ✅ GitHub Pages root
  "https://siriwimom.github.io/Holiday_Pastry", // ✅ GitHub Pages repo path
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("❌ Blocked by CORS:", origin);
        callback(new Error("CORS not allowed for: " + origin));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "x-user-id"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.options("*", cors());

// ===== Middleware =====
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ===== Static uploads =====
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== Logging incoming routes (debug) =====
app.use((req, _res, next) => {
  console.log("📩", req.method, req.originalUrl);
  next();
});

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/purchases", purchasesRoutes);

// ===== Default route =====
app.get("/", (_req, res) => {
  res.json({
    ok: true,
    message: "🍰 Holiday Pastry Backend is running successfully!",
  });
});

// ===== 404 handler =====
app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Not Found" });
});

// ===== Error handler =====
app.use((err, _req, res, _next) => {
  console.error("💥 Server Error:", err.message);
  res.status(500).json({
    ok: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

// ===== Connect MongoDB =====
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
