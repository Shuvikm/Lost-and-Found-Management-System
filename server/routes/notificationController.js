const Notification = require("../models/NotificationSchema");

const listForUser = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id.toString() }).sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (e) {
    console.error("Error listing notifications:", e);
    res.status(500).send("Internal Server Error");
  }
};

const markRead = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!updated) return res.status(404).json({ message: "Notification not found" });
    res.json({ notification: updated });
  } catch (e) {
    console.error("Error marking notification read:", e);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { listForUser, markRead };
