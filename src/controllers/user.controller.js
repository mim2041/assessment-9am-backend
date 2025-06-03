const { User } = require("../models/User");

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -refreshTokens"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        shopNames: user.shopNames,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const validateShopAccess = async (req, res, next) => {
  try {
    const { shopName } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user || !user.shopNames.includes(shopName.toLowerCase())) {
      return res.status(403).json({ error: "Access denied to this shop" });
    }

    res.json({
      shopName,
      owner: user.username,
      message: `Welcome to ${shopName} shop dashboard`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  validateShopAccess,
};
