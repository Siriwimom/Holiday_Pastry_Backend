// backend/routes/cart.js
import express from "express";
import Cart from "../models/Cart.js";              // <== เส้นทางถูก (จาก routes/.. ไป models/)
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = await Cart.create({ userId, items: [] });
    return res.json({ ok: true, userId, items: cart.items });
  } catch (e) {
    console.error("GET /cart err:", e);
    res.status(500).json({ message: "Fetch cart failed" });
  }
});

router.put("/", requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $set: { items } },
      { new: true, upsert: true }
    );
    return res.json({ ok: true, items: cart.items });
  } catch (e) {
    console.error("PUT /cart err:", e);
    res.status(500).json({ message: "Save cart failed" });
  }
});

export default router;
