const db = require("../models");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await db.User.create({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      isActive: req.body.isActive,
      isAdmin: req.body.isAdmin,
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
    const users = await db.User.findAll();
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
    const user = await db.User.findOne({ where: { id: req.params.id } });

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

    await db.User.update(
      {
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        isActive: req.body.isActive,
        isAdmin: req.body.isAdmin,
      },
      {
        where: {
          id: id_params,
        },
      }
    );

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