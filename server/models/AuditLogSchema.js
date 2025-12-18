const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
  user: { type: String },
  details: { type: Object },
}, { timestamps: true });

module.exports = mongoose.model("AuditLog", AuditLogSchema);
