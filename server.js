import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://siriwimom.github.io"
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "x-user-id"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Holiday Pastry API is running 🍰");
});

// ตัวอย่างเชื่อม MongoDB
import mongoose from "mongoose";
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ DB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
