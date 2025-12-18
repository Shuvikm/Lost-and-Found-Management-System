const ClaimRequest = require("../models/ClaimRequestSchema");
const Item = require("../models/ItemSchema");
const Notification = require("../models/NotificationSchema");

const createClaim = async (req, res) => {
  try {
    const { itemId, requesterName, requesterMobile, requesterHostel, proofOfClaim } = req.body;
    const item = await Item.findById(itemId);
    if (!item || item.isDeleted) return res.status(404).json({ message: "Item not available" });

    const claim = await ClaimRequest.create({
      item: itemId,
      requesterName,
      requesterMobile,
      requesterHostel,
      proofOfClaim,
      createdBy: req.user?._id?.toString() || "anonymous"
    });

    // Notify item owner (if we have user id string)
    if (item.user) {
      await Notification.create({
        user: item.user,
        type: "info",
        message: `New claim request for item ${item.itemname}`,
      });
    }

    res.status(201).json({ claim });
  } catch (e) {
    console.error("Error creating claim:", e);
    res.status(500).send("Internal Server Error");
  }
};

const listClaims = async (req, res) => {
  try {
    const claims = await ClaimRequest.find().sort({ createdAt: -1 });
    res.json({ claims });
  } catch (e) {
    console.error("Error listing claims:", e);
    res.status(500).send("Internal Server Error");
  }
};

const getClaim = async (req, res) => {
  try {
    const claim = await ClaimRequest.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: "Claim not found" });
    res.json({ claim });
  } catch (e) {
    console.error("Error getting claim:", e);
    res.status(500).send("Internal Server Error");
  }
};

const updateClaimStatus = async (req, res) => {
  try {
    const { status } = req.body; // approved or rejected
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const claim = await ClaimRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    if (status === 'approved') {
      // mark item claimed
      await Item.findByIdAndUpdate(claim.item, { status: 'claimed' });
    }

    res.json({ claim });
  } catch (e) {
    console.error("Error updating claim status:", e);
    res.status(500).send("Internal Server Error");
  }
};

const listClaimsForItem = async (req, res) => {
  try {
    const claims = await ClaimRequest.find({ item: req.params.id });
    res.json({ claims });
  } catch (e) {
    console.error("Error listing item claims:", e);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createClaim,
  listClaims,
  getClaim,
  updateClaimStatus,
  listClaimsForItem,
};
