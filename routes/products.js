// backend/routes/products.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Product from "../models/Product.js";

const router = express.Router();

/* ---------- Upload Directory ---------- */
const uploadDir = path.join(process.cwd(), "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

/* ---------- Multer Configuration ---------- */
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

/* ---------- Base URL สำหรับ Render ---------- */
const BASE =
  process.env.PUBLIC_BASE_URL ||
  "https://holiday-pastry-backend.onrender.com";

/* ---------- CREATE ---------- */
router.post("/", uploadFields, async (req, res) => {
  try {
    const { name = "", price = 0, category = "BS", description = "" } = req.body;
    const files = req.files || {};
    const mainFile = files.imageMain?.[0] || null;
    const sideFiles = files.imageSide || [];

    const imageMainUrl = mainFile
      ? `${BASE}/uploads/${mainFile.filename}`
      : sideFiles[0]
      ? `${BASE}/uploads/${sideFiles[0].filename}`
      : "";

    const imageSideUrls = sideFiles.map((f) => `${BASE}/uploads/${f.filename}`);

    const doc = await Product.create({
      name,
      price: Number(price) || 0,
      category,
      description,
      imageMainUrl,
      imageSideUrls,
    });

    res.json(doc);
  } catch (e) {
    console.error("❌ create product error:", e);
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
      p.imageSideUrls.push(...sideFiles.map((f) => `${BASE}/uploads/${f.filename}`));
    }

    // กันเคสเก่าที่ยังไม่มี main
    if (!p.imageMainUrl && p.imageSideUrls?.length) {
      p.imageMainUrl = p.imageSideUrls[0];
    }

    await p.save();
    res.json(p);
  } catch (e) {
    console.error("❌ update product error:", e);
    res.status(500).json({ message: "Update failed" });
  }
});

/* ---------- READ ---------- */
router.get("/", async (req, res) => {
  try {
    const list = await Product.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Not found" });
    res.json(p);
  } catch (e) {
    res.status(500).json({ message: "Fetch single failed" });
  }
});

/* ---------- DELETE ---------- */
router.delete("/:id", async (req, res) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ message: "Not found" });
    res.json({ ok: true, deletedId: req.params.id });
  } catch (e) {
    res.status(500).json({ message: "Delete failed" });
  }
});

/* ---------- Static Serve for Uploads ---------- */
// Render จะส่งไฟล์รูปในโฟลเดอร์ uploads ได้ผ่าน URL
router.use("/uploads", express.static(uploadDir));

export default router;
