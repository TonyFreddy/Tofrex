const mongoose = require("mongoose");

const creatorSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  bio:        { type: String, maxlength: 500, default: "" },
  coverImage: { type: String, default: "" },
  monthlyPrice:   { type: Number, required: true }, 
  lsProductId:    { type: String, default: "" },    
  lsVariantId:    { type: String, default: "" },    
}, { timestamps: true });

module.exports = mongoose.model("Creator", creatorSchema);