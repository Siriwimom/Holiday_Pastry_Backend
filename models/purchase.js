import mongoose from "mongoose";

const LineSchema = new mongoose.Schema({
  key: String,           // key เดียวกับ cart
  productId: String,     // ถ้ามี
  name: String,
  price: Number,
  qty: Number,
  img: String,
  meta: { type: Object, default: {} },
}, { _id:false });

const PurchaseSchema = new mongoose.Schema({
  userId: { type: String, index: true, required: true },
  items: { type: [LineSchema], default: [] },
  subtotal: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  status: { type: String, default: "pending" }, // pending/paid/shipped/received
}, { timestamps: true });

export default mongoose.model("Purchase", PurchaseSchema);
