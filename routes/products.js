// backend/routes/products.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Product from "../models/Product.js";

const router = express.Router();

/* ---------- upload dir ---------- */
const uploadDir = path.join(process.cwd(), "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

/* ---------- Multer ---------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    cb(null, `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({ storage });

// รองรับทั้งรูปหลักและรูปด้านข้างหลายไฟล์
const uploadFields = upload.fields([
  { name: "imageMain", maxCount: 1 },
  { name: "imageSide", maxCount: 20 },
]);

// base URL ที่ใช้ประกอบลิงก์รูป
const BASE = process.env.PUBLIC_BASE_URL || "http://localhost:5000";

/* ---------- CREATE ---------- */
router.post("/", uploadFields, async (req, res) => {
  try {
    const { name = "", price = 0, category = "BS", description = "" } = req.body;
    const files = req.files || {};
    const mainFile = files.imageMain?.[0] || null;
    const sideFiles = files.imageSide || [];

    const imageMainUrl = mainFile
      ? `${BASE}/uploads/${mainFile.filename}`
      : (sideFiles[0] ? `${BASE}/uploads/${sideFiles[0].filename}` : "");

    const imageSideUrls = sideFiles.map(f => `${BASE}/uploads/${f.filename}`);

    const doc = await Product.create({
      name,
      price: Number(price) || 0,
      category,
      description,
      imageMainUrl,
      imageSideUrls
    });

    res.json(doc);
  } catch (e) {
    console.error("create product error:", e);
    res.status(500).json({ message: "Create failed" });
  }
});


/* ---------- UPDATE ---------- */
router.put("/:id", uploadFields, async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Not found" });

    const { name, price, category, description } = req.body;
    if (name != null) p.name = name;
    if (price != null) p.price = Number(price) || 0;
    if (category != null) p.category = category;
    if (description != null) p.description = description;

    const files = req.files || {};
    const mainFile = files.imageMain?.[0] || null;
    const sideFiles = files.imageSide || [];

    if (mainFile) {
      p.imageMainUrl = `${BASE}/uploads/${mainFile.filename}`;
    }
    if (sideFiles.length) {
      p.imageSideUrls.push(...sideFiles.map(f => `${BASE}/uploads/${f.filename}`));
    }

    // กันเคสเก่า ๆ ที่ยังไม่มี main
    if (!p.imageMainUrl) {
      if (p.imageSideUrls?.length) p.imageMainUrl = p.imageSideUrls[0];
    }

    await p.save();
    res.json(p);
  } catch (e) {
    console.error("update product error:", e);
    res.status(500).json({ message: "Update failed" });
  }
});

/* ---------- READ ---------- */
router.get("/", async (req, res) => {
  const list = await Product.find().sort({ createdAt: -1 });
  res.json(list);
});

router.get("/:id", async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: "Not found" });
  res.json(p);
});

/* ---------- DELETE ---------- */
router.delete("/:id", async (req, res) => {
  const p = await Product.findByIdAndDelete(req.params.id);
  if (!p) return res.status(404).json({ message: "Not found" });
  res.json({ ok: true, deletedId: req.params.id });
});

export default router;
