const mongoose = require("mongoose");

const notifSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type:    { type: String, enum: ["subscription", "tip", "like"], required: true },
  fromId:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: { type: String, default: "" },
  read:    { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Notification", notifSchema);