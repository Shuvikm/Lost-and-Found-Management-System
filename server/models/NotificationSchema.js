const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  user: { type: String, required: true },
  type: { type: String, enum: ["info", "success", "warning"], default: "info" },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Notification", NotificationSchema);
