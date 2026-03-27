const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth.route");
const messageRoutes = require("./routes/message.route");
const { connectDB } = require("./lib/db");
const { ENV } = require("./lib/env");
const { app, server } = require("./lib/socket");

const PORT = ENV.PORT || 5000;

app.use(express.json({ limit: "5mb" }));
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
  console.log("Server running on port:", PORT);
  connectDB();
});

