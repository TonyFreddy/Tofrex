const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ENV } = require("../lib/env");

const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    if (!token) return next(new Error("Unauthorized - No token provided"));

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) return next(new Error("Unauthorized - Invalid token"));

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return next(new Error("User not found"));

    socket.user = user;
    socket.userId = user._id.toString();
    next();
  } catch (error) {
    console.log("Socket auth error:", error.message);
    next(new Error("Unauthorized - Authentication failed"));
  }
};

module.exports = { socketAuthMiddleware };