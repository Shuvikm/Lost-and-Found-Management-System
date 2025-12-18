// middleware/validationMiddleware.js
const { body, param, validationResult } = require("express-validator");

// User validations
const validateSignup = [
  body("username").isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
  body("rollno").notEmpty().withMessage("Roll number is required"),
  body("email").isEmail().withMessage("Enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateLogin = [
  body("email").isEmail().withMessage("Enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Item validations
const validateItem = [
  body("itemname").isLength({ min: 3 }).withMessage("Item name must be at least 3 characters"),
  body("itemdescription")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),
  body("concerntype").isIn(["lost", "found"]).withMessage("Type must be 'lost' or 'found'"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Claimant validations
const validateClaimant = [
  body("claimantname").notEmpty().withMessage("Name is required"),
  body("mobilenumber").notEmpty().withMessage("Mobile number is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Helper validations
const validateHelper = [
  body("helpername").notEmpty().withMessage("Name is required"),
  body("mobilenumber").notEmpty().withMessage("Mobile number is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateSignup,
  validateLogin,
  validateItem,
  validateClaimant,
  validateHelper,
};
