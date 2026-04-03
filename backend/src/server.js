const express            = require("express");
const cookieParser       = require("cookie-parser");
const cors               = require("cors");
const authRoutes         = require("./routes/auth.route");
const messageRoutes      = require("./routes/message.route");
const creatorRoutes      = require("./routes/creator.route");
const subscriptionRoutes = require("./routes/subscription.route");
const { connectDB }      = require("./lib/db");
const { ENV }            = require("./lib/env");
const { app, server }    = require("./lib/socket");

const PORT = ENV.PORT || 5000;


app.use("/api/subscriptions/webhook", express.raw({ type: "application/json" }));

app.use(express.json({ limit: "50mb" }));
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(cookieParser());

app.use("/api/auth",          authRoutes);
app.use("/api/messages",      messageRoutes);
app.use("/api/creators",      creatorRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

server.listen(PORT, () => {
  console.log("Server running on port:", PORT);
  connectDB();
});