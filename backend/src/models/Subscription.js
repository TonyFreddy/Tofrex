const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  subscriberId:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  creatorId:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lsSubscriptionId:   { type: String, default: "" },
  lsCustomerId:       { type: String, default: "" },
  status:             { type: String, enum: ["active", "cancelled", "past_due", "incomplete", "expired"], default: "incomplete" },
  currentPeriodEnd:   { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);