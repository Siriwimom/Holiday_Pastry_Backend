import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // profile info
    username: String,
    phone: String,
    address: String,
    bankFirst: String,
    bankLast: String,
    bankNumber: String,
    bankType: String,
    profileImage: String,
    bankImage: String,
    province: String,
    street: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
