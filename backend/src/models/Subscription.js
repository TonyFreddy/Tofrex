const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  subscriberId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  creatorId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  transactionId:  { type: String, default: "" },
  amount:         { type: Number, required: true },
  status:         { type: String, enum: ["active", "expired", "cancelled"], default: "active" },
  expiresAt:      { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);