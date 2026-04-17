require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({status: "fail", message: "Không có token, vui lòng đăng nhập lại!" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ status: "fail",message: "Token không hợp lệ!" });
  }
};