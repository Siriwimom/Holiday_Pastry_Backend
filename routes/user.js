import express from "express";
import User from "../models/User.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

// ✅ GET /api/user/me → ดึงข้อมูลตัวเอง
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("GET /me error:", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});


// ✅ PUT /api/user/me → อัปเดตข้อมูลตัวเอง
router.put("/me", auth, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json(updated);
  } catch (err) {
    console.error("PUT /me error:", err);
    res.status(400).json({ message: "Update failed", error: err });
  }
});

export default router;
