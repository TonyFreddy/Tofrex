const mongoose = require("mongoose");

const tipSchema = new mongoose.Schema({
  fromUserId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  toCreatorId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount:        { type: Number, required: true },
  transactionId: { type: String, default: "" },
  message:       { type: String, maxlength: 200, default: "" },
  status:        { type: String, enum: ["pending", "succeeded", "failed"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Tip", tipSchema);