const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await db.User.findOne({ where: { username: username } });
    if (!user) {
      return res.status(404).json("User not found");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      // If the passwords do not match, send an error response with status code 401 Unauthorized
      return res.status(401).json({ error: "Invalid password" });
    }
    const token = await jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin, isActive: user.isActive },
      "testaxiansjwtjwt"
    );
    // Send the token as a response with status code 200
    return res
      .status(200)
      .json({
        token: token,
        username: user.username,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
      });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

/*
exports.current = async (req, res) => {
  try {
    let user  = await db.User.findOne({ where:{ id : req. },attributes: {exclude: ['password']}});
    res.json({ message: "User retrieved", result: user })
  } catch (err) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }

};
*/