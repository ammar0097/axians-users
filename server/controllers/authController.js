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
      isAdmin: user.isAdmin,
      isNew: user.isNew,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.newpass = async (req, res) => {
  const id_params = req.userId;
  try {
    const user = await db.User.findByPk(id_params);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {  password } = req.body;

 
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
 


  
    hashed = ''
    if (password){
  // Validate password length and complexity
  if (password && (password.length < 12 || password.length > 20)) {
    return res.status(400).json({ message: 'Password must be between 12 and 20 characters' });
  }

  if (password && !validator.isStrongPassword(password, { minNumbers: 1, minSymbols: 1 })) {
    return res.status(400).json({
      message:
        'Password must contain at least one number, one special character, and not have repeated characters in a row',
    });
  }

  // Validate password contains at least one uppercase and one lowercase character
  if (password && (!/[A-Z]/.test(password) || !/[a-z]/.test(password))) {
    return res.status(400).json({ message: 'Password must contain at least one uppercase and one lowercase letter' });
  }

  // Validate password doesn't have consecutive repeated characters
  if (password && /(.)(\1)/.test(password)) {
    return res.status(400).json({ message: 'Password cannot have consecutive repeated characters' });
  }
  const salt = await bcrypt.genSalt(10);
  hashed = await bcrypt.hash(password, salt);
}





// Update the user
await db.User.update(
  {
    password: hashed,
    isNew: 0,
  },
  {
    where: {
      id: id_params,
    },
  })
    return res.status(200).json({
      message: "User updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};