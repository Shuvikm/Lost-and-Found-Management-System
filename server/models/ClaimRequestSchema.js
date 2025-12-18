const mongoose = require("mongoose");

const ClaimRequestSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  requesterName: { type: String, required: true },
  requesterMobile: { type: String, required: true },
  requesterHostel: { type: String },
  proofOfClaim: { type: String },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdBy: { type: String, required: true }, // user id string
}, { timestamps: true });

module.exports = mongoose.model("ClaimRequest", ClaimRequestSchema);
