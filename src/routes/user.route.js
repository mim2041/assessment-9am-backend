const express = require("express");
const {
  getProfile,
  validateShopAccess,
} = require("../controllers/user.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/profile", authenticate, getProfile);
router.get("/shop/:shopName", authenticate, validateShopAccess);

module.exports = router;
