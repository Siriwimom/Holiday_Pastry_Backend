import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, default: 0 },
    category: { type: String, default: "BS" },
    description: { type: String, default: "" },

    // ✅ ฟิลด์ใหม่-ทางการ
    imageMainUrl: { type: String, default: "" },
    imageSideUrls: { type: [String], default: [] },

    // (เผื่อของเก่า)
    imageMainUrl: { type: String, default: null },
    imageSideUrls: { type: [String], default: [] },

  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
