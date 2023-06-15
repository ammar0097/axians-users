const db = require("../models");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  try {
    const password = req.body.password;
    // Generate a salt to be used for hashing the password
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await db.User.create({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      isActive: req.body.isActive,
      isAdmin: req.body.isAdmin
    });
    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.getAllUsers = async (req, res) => {
  const users = await db.User.findAll();
  if (!users) {
    return res.status(500).send("No users found!");
  }
  return res.status(200).send(users);
};

exports.getUserById = async (req, res) => {
  try {
    const user = await db.User.findOne({ where: { id: req.params.id } });

    if (!user) {
      res.status(404).send("User not found");
    }
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.updateUser = async (req, res) => {
  const id_params = req.params.id;
  try {
    const user = await db.User.findByPk(id_params);
    if (!user) {
      res.status(404).send("user not found");
    }

    await db.User.update(
      {
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        isActive: req.body.isActive,
        isAdmin: req.body.isAdmin
      },
      {
        where: {
          id: id_params,
        },
      }
    );

    return res.status(200).send("user updated");
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id_param = req.params.id;
    const user = await db.User.findByPk(id_param);
    if (!user) {
      return res.status(404).send("user not found");
    }
    await db.User.destroy({ where: { id: id_param } });
    return res.status(200).send("user deleted");
  } catch (error) {
    return res.status(500).send(error);
  }
};
