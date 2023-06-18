const db = require("../models");
const bcrypt = require("bcrypt");
const validator = require('validator');
const jwt = require("jsonwebtoken");

exports.currentUser = async (req, res) => {
  try {
    const user = await db.User.findOne({ where: { id: req.userId },  attributes: { exclude: ["password"] } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      data: user,
      message: "User fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await db.User.findOne({ where: { username: username } });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    if (!user.isActive) {
      return res.status(401).json({ message: "Account is disabled" });
    }
    const token = await jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin, isActive: user.isActive },
      "testaxiansjwtjwt"
    );

    return res.status(200).json({
      token: token,
      username: user.username,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};