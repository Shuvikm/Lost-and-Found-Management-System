// server.js

// Load environment variables
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const connectToMongo = require("./config/connectToMongo");
const itemController = require("./routes/itemController");
const userController = require("./routes/userController");
const claimantController = require("./routes/claimantController");
const helperController = require("./routes/helperController");
const requireAuth = require("./middleware/requireAuth");
const requireRole = require("./middleware/requireRole");
const errorHandler = require("./middleware/errorHandler");
const {
  validateSignup,
  validateLogin,
  validateItem,
  validateClaimant,
  validateHelper,
} = require("./middleware/validationMiddleware");

// Create an express app
const app = express();

// Configure express app
app.use(express.json({ limit: "500mb" })); // Adjust the limit as needed based on image
app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(mongoSanitize());
app.use(xssClean());
app.use(hpp());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Basic rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
});
app.use(limiter);

app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.56.1:3000", "https://yourdomain.com"],
    credentials: true,
  })
);

// Connect to the database
connectToMongo();

// Health check endpoint
app.get("/health", (req, res) => {
  const mongoose = require("mongoose");
  res.json({
    status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Routing
app.post("/signup", validateSignup, userController.signup);
app.post("/login", validateLogin, userController.login);
app.get("/logout", userController.logout);
app.get("/fetchuser/:id", userController.fetchUser);
app.get("/check-auth", requireAuth, userController.checkAuth);

// Items
app.post("/item/:id", requireAuth, validateItem, itemController.createItem);
app.put("/item/:id", requireAuth, validateItem, itemController.updateItem);
app.get("/item/user/:id", requireAuth, itemController.fetchUserSpecificItems);
app.get("/item", itemController.fetchItems); // supports query filters
app.get("/item/:id", itemController.fetchItem);
app.delete("/item/:id", requireAuth, itemController.deleteItem);

app.post("/claimant", validateClaimant, claimantController.createClaimant);
app.put("/claimant/:id", validateClaimant, claimantController.updateClaimant);
app.get("/claimant", claimantController.fetchClaimants);
app.get("/claimant/:id", claimantController.fetchClaimant);
app.delete("/claimant/:id", claimantController.deleteClaimant);

app.post("/helper", validateHelper, helperController.createHelper);
app.put("/helper/:id", validateHelper, helperController.updateHelper);
app.get("/helper", helperController.fetchHelpers);
app.get("/helper/:id", helperController.fetchHelper);
app.delete("/helper/:id", helperController.deleteHelper);

// Claims & Notifications (admin routes secured by role)
const claimController = require("./routes/claimController");
const notificationController = require("./routes/notificationController");
app.post("/claims", requireAuth, claimController.createClaim);
app.get("/claims", requireAuth, requireRole("admin"), claimController.listClaims);
app.get("/claims/:id", requireAuth, claimController.getClaim);
app.patch(
  "/claims/:id",
  requireAuth,
  requireRole("admin"),
  claimController.updateClaimStatus
);
app.get("/item/:id/claims", requireAuth, claimController.listClaimsForItem);

app.get("/notifications", requireAuth, notificationController.listForUser);
app.patch("/notifications/:id/read", requireAuth, notificationController.markRead);

// Error handling middleware
app.use(errorHandler);

// Start our server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
