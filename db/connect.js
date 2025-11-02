// backend/db/connect.js
import mongoose from "mongoose";

export default async function connectDB(uri) {
  if (!uri) throw new Error("MONGO_URI missing");
  await mongoose.connect(uri, { dbName: process.env.DB_NAME || "holiday_pastry" });
  console.log("MongoDB connected");
}
  