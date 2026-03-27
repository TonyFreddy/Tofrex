const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const { ENV } = require("./env");
const { socketAuthMiddleware } = require("../middleware/socket.auth.middleware");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL],
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

const userSocketMap = {};

const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.user.fullName);
  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { io, app, server, getReceiverSocketId };