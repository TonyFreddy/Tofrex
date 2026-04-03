const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  caption:   { type: String, maxlength: 1000, default: "" },
  mediaUrl:  { type: String, required: true },
  mediaType: { type: String, enum: ["image", "video"], required: true },
  isPremium: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);