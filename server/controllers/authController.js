const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await db.User.findOne({ where: { username: username } });
    if (!user) {
    return  res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      // If the passwords do not match, send an error response with status code 401 (Unauthorized)
     return res.status(401).json({ error: "Invalid password" });
    }
    const token = await jwt.sign({ userId: user.id, isAdmin : user.isAdmin, isActive : user.isActive }, "testaxiansjwtjwt");
    // Send the token as a response with status code 200
  return  res.status(200).json({ token });

  } catch (error) {
  return res.status(500).json({ error: "Internal server error" });
  }
};
