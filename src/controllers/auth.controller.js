const { User, ShopName } = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt.utils");
const mongoose = require("mongoose");

const signup = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { username, password, shopNames } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Username already exists" });
    }

    // Check if any shop names already exist
    const existingShops = await ShopName.find({
      name: { $in: shopNames.map((name) => name.toLowerCase()) },
    });

    if (existingShops.length > 0) {
      await session.abortTransaction();
      const takenNames = existingShops.map((shop) => shop.name);
      return res.status(400).json({
        error: "Some shop names are already taken",
        takenNames,
      });
    }

    // Create user
    const user = new User({
      username,
      password,
      shopNames: shopNames.map((name) => name.toLowerCase()),
    });

    await user.save({ session });

    // Create shop name records
    const shopDocs = shopNames.map((name) => ({
      name: name.toLowerCase(),
      owner: user._id,
    }));

    await ShopName.insertMany(shopDocs, { session });

    await session.commitTransaction();

    res.status(201).json({
      message: "User created successfully",
      userId: user._id,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

const signin = async (req, res, next) => {
  try {
    const { username, password, rememberMe } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Clean expired tokens
    user.cleanExpiredTokens();

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = rememberMe ? generateRefreshToken(user._id) : null;

    if (refreshToken) {
      user.refreshTokens.push({ token: refreshToken });
      await user.save();
    }

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        shopNames: user.shopNames,
      },
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token required" });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    // Find user and check if refresh token exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Clean expired tokens
    user.cleanExpiredTokens();

    const tokenExists = user.refreshTokens.some(
      (tokenObj) => tokenObj.token === refreshToken
    );
    if (!tokenExists) {
      return res
        .status(401)
        .json({ error: "Refresh token not found or expired" });
    }

    // Generate new access token
    const accessToken = generateAccessToken(user._id);

    await user.save();

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const userId = req.user._id;

    if (refreshToken) {
      const user = await User.findById(userId);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter(
          (tokenObj) => tokenObj.token !== refreshToken
        );
        await user.save();
      }
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  signin,
  refreshToken,
  logout,
};
