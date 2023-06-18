const db = require("../models");
const bcrypt = require("bcrypt");
const validator = require("validator");

exports.createUser = async (req, res) => {
  try {
    const {
      username,
      firstName,
      lastName,
      email,
      password,
      isNew,
      isActive,
      isAdmin,
    } = req.body;

    // Validate fields
    if (!username || !firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate username uniqueness
    const existingUsername = await db.User.findOne({
      where: { username: username },
    });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Validate email uniqueness
    const existingEmail = await db.User.findOne({ where: { email: email } });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Validate username alphanumeric
    if (!validator.isAlphanumeric(username)) {
      return res.status(400).json({ message: "Username must be alphanumeric" });
    }

    // Validate password length and complexity
    if (password.length < 12 || password.length > 20) {
      return res
        .status(400)
        .json({ message: "Password must be between 12 and 20 characters" });
    }

    if (
      !validator.isStrongPassword(password, { minNumbers: 1, minSymbols: 1 })
    ) {
      return res.status(400).json({
        message:
          "Password must contain at least one number, one special character, and not have repeated characters in a row",
      });
    }

    // Validate password contains at least one uppercase and one lowercase character
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      return res
        .status(400)
        .json({
          message:
            "Password must contain at least one uppercase and one lowercase letter",
        });
    }
    // Validate password doesn't have consecutive repeated characters
    if (/(.)\1/.test(password)) {
      return res
        .status(400)
        .json({
          message: "Password cannot have consecutive repeated characters",
        });
    }

    //  create the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await db.User.create({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isActive,
      isAdmin,
      isNew,
    });

    return res.status(200).json({
      data: user,
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: { exclude: ["password"] },
    });
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json({
      data: users,
      message: "Users fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await db.User.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ["password"] },
    });

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

exports.updateUser = async (req, res) => {
  const id_params = req.params.id;
  try {
    const user = await db.User.findByPk(id_params);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {
      username,
      firstName,
      lastName,
      email,
      password,
      isNew,
      isActive,
      isAdmin,
    } = req.body;

    // Validate fields
    if (!username || !firstName || !lastName || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate username uniqueness
    if (username !== user.username) {
      const existingUsername = await db.User.findOne({
        where: { username: username },
      });
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    // Validate email uniqueness
    if (email !== user.email) {
      const existingEmail = await db.User.findOne({ where: { email: email } });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // Validate username alphanumeric
    if (!validator.isAlphanumeric(username)) {
      return res.status(400).json({ message: "Username must be alphanumeric" });
    }
    hashed = "";
    if (password) {
      // Validate password length and complexity
      if (password && (password.length < 12 || password.length > 20)) {
        return res
          .status(400)
          .json({ message: "Password must be between 12 and 20 characters" });
      }

      if (
        password &&
        !validator.isStrongPassword(password, { minNumbers: 1, minSymbols: 1 })
      ) {
        return res.status(400).json({
          message:
            "Password must contain at least one number, one special character, and not have repeated characters in a row",
        });
      }

      // Validate password contains at least one uppercase and one lowercase character
      if (password && (!/[A-Z]/.test(password) || !/[a-z]/.test(password))) {
        return res
          .status(400)
          .json({
            message:
              "Password must contain at least one uppercase and one lowercase letter",
          });
      }

      // Validate password doesn't have consecutive repeated characters
      if (password && /(.)(\1)/.test(password)) {
        return res
          .status(400)
          .json({
            message: "Password cannot have consecutive repeated characters",
          });
      }
      const salt = await bcrypt.genSalt(10);
      hashed = await bcrypt.hash(password, salt);
    }
    const updateObject = {
      username,
      firstName,
      lastName,
      email,
      isActive,
      isAdmin,
      isNew,
    };

    if (hashed) {
      updateObject.password = hashed;
    }

    // Update the user
    await db.User.update(updateObject, {
      where: {
        id: id_params,
      },
    });
    return res.status(200).json({
      message: "User updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id_param = req.params.id;
    const user = await db.User.findByPk(id_param);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await db.User.destroy({ where: { id: id_param } });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
