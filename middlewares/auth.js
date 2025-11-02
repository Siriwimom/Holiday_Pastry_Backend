import jwt from "jsonwebtoken";

// ✅ ตรวจ token หลัก (ใช้สำหรับ route ที่ต้อง login)
export const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    req.user = { id: decoded.sub, role: decoded.role || "user" };

    return next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ ตรวจ token หรือ header fallback (x-user-id / uid)
export const requireAuth = (req, res, next) => {
  const hdrs = req.headers || {};
  const bearer =
    hdrs.authorization && hdrs.authorization.startsWith("Bearer ")
      ? hdrs.authorization.slice(7)
      : null;

  // fallback: ใช้ header x-user-id แทน token ได้ (เช่น cart)
  const headerUid = hdrs["x-user-id"] || hdrs["uid"];

  if (bearer) {
    try {
      const payload = jwt.verify(bearer, process.env.JWT_SECRET || "devsecret");
      req.user = { _id: payload.sub, role: payload.role || "user" };
      return next();
    } catch (e) {
      console.error("JWT Verify failed:", e.message);
      // จะลองใช้ headerUid ด้านล่างต่อ
    }
  }

  if (headerUid) {
    req.user = { _id: headerUid, role: "user" };
    return next();
  }

  return res.status(401).json({ message: "Unauthorized" });
};

// ✅ ตรวจ role เช่น admin หรือ user
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};
