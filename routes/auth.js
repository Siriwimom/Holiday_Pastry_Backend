import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

/* ========================================
   🔍 DEBUG & CHECK EMAIL
======================================== */
router.get("/ping", (req, res) => res.json({ ok: true, where: "auth" }));

// ✅ ตรวจสอบว่าอีเมลซ้ำไหม (ตอนสมัคร)
router.post("/check-email", async (req, res) => {
  try {
    const email = (req.body?.email || "").trim().toLowerCase();
    if (!email) return res.status(400).json({ message: "Email is required" });

    const exist = await User.findOne({ email });
    res.json({
      ok: true,
      exists: !!exist,
      email: exist ? exist.email : null,
    });
  } catch (e) {
    console.error("check-email error:", e);
    res.status(500).json({ message: "Check email failed" });
  }
});

/* ========================================
   🔑 LOGIN
======================================== */
router.post("/login", async (req, res) => {
  try {
    const email = (req.body?.email || "").trim().toLowerCase();
    const password = req.body?.password || "";

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const u = await User.findOne({ email }).select("+passwordHash");
    if (!u) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, u.passwordHash || "");
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { sub: u._id.toString(), role: u.role || "user" },
      process.env.JWT_SECRET || "devsecret",
      { expiresIn: "7d" }
    );

    res.json({
      ok: true,
      user: {
        _id: u._id,
        name: u.name || "",
        email: u.email || "",
        role: u.role || "user",
        phone: u.phone || "",
        address: u.address || "",
        province: u.province || "",
        street: u.street || "",
        bankFirst: u.bankFirst || "",
        bankLast: u.bankLast || "",
        bankNumber: u.bankNumber || "",
        bankType: u.bankType || "",
        profileImage: u.profileImage || "",
        bankImage: u.bankImage || "",
      },
      token,
    });
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ message: "Login failed" });
  }
});

/* ========================================
   🔐 RESET PASSWORD (ผู้ใช้ล็อกอินอยู่)
======================================== */
router.post("/reset-password", async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    if (!email || !oldPassword || !newPassword)
      return res.status(400).json({ message: "Missing required fields" });

    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(oldPassword, user.passwordHash || "");
    if (!match)
      return res.status(400).json({ message: "Current password is incorrect" });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ ok: true, message: "Password changed successfully" });
  } catch (e) {
    console.error("Reset-password error:", e);
    res.status(500).json({ message: "Password change failed" });
  }
});

/* ========================================
   🔄 RESET PASSWORD DIRECT (FORGOT PASSWORD)
======================================== */
router.post("/reset-password-direct", async (req, res) => {
  try {
    const email = (req.body?.email || "").trim().toLowerCase();
    const pwd = (req.body?.newPassword ?? req.body?.password)?.toString() || "";

    if (!email || !pwd)
      return res.status(400).json({ message: "Email and newPassword are required" });

    const u = await User.findOne({ email });
    if (!u) return res.status(404).json({ message: "User not found" });

    u.passwordHash = await bcrypt.hash(pwd, 10);
    await u.save();

    res.json({ ok: true, message: "Password reset successful" });
  } catch (e) {
    console.error("reset-password-direct error:", e);
    res.status(500).json({ message: "Password change failed" });
  }
});
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "Missing required fields" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, passwordHash: hash });

    const token = jwt.sign(
      { sub: user._id, role: user.role || "user" },
      process.env.JWT_SECRET || "devsecret",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      user: { _id: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    console.error("POST /register error:", err);
    res.status(500).json({ message: "Register failed", error: err.message });
  }
});


export default router;
