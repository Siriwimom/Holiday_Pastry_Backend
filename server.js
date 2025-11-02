import cors from "cors";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const allowedOrigins = [
  "https://siriwimom.github.io",
  "https://siriwimom.github.io/Holiday_Pastry",
  "http://localhost:5173" // เผื่อเทสในเครื่อง
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

app.get("/", (req, res) => {
  res.send("Holiday Pastry API is running 🍰");
});
