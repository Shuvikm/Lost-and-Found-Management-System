module.exports = (role) => (req, res, next) => {
  try {
    if (!req.user) return res.status(401).send("Unauthorized");
    if (req.user.role !== role) return res.status(403).send("Forbidden");
    next();
  } catch (e) {
    console.error("Error in requireRole middleware:", e);
    return res.status(403).send("Forbidden");
  }
};
