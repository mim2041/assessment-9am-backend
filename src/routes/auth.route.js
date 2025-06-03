const express = require("express");
const {
  signup,
  signin,
  refreshToken,
  logout,
} = require("../controllers/auth.controller");
const {
  validateSignup,
  validateSignin,
  handleValidationErrors,
} = require("../utils/validation.utils");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/signup", validateSignup, handleValidationErrors, signup);
router.post("/signin", validateSignin, handleValidationErrors, signin);
router.post("/refresh", refreshToken);
router.post("/logout", authenticate, logout);

module.exports = router;
