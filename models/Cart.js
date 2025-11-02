// backend/models/cart.js
import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  key: String,
  name: String,
  price: Number,
  qty: Number,
  img: String,
  meta: Object,
});

const CartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    items: { type: [ItemSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Cart", CartSchema);
