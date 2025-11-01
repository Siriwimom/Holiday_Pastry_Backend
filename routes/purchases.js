import express from "express";
import Purchase from "../models/purchase.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

// GET /api/purchases → ออเดอร์ของ user คนนั้น
router.get("/", requireAuth, async (req, res) => {
  const userId = req.user?._id;
  const rows = await Purchase.find({ userId }).sort({ createdAt: -1 }).lean();
  res.json({ ok: true, rows });
});

// POST /api/purchases/checkout → สร้างออเดอร์จาก items ที่จ่ายสำเร็จ
router.post("/checkout", requireAuth, async (req, res) => {
  const userId = req.user?._id;
  const { items = [], subtotal = 0, shipping = 0, total = 0 } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "No items" });
  }

  const doc = await Purchase.create({
    userId,
    items,
    subtotal,
    shipping,
    total,
    status: "paid",
  });
  res.json({ ok: true, purchase: { id: doc._id } });
});

export default router;
