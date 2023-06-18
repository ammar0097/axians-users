const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const requireLogin = require('../middleware/requireLogin');
const requireAdmin = require('../middleware/requireAdmin');

router.post('/users',requireLogin,requireAdmin,userController.createUser);
router.get('/users',requireLogin,userController.getAllUsers);
router.get('/users/:id',requireLogin,userController.getUserById);
router.delete('/users/:id',requireLogin,requireAdmin,userController.deleteUser);
router.put('/users/:id',requireLogin,requireAdmin,userController.updateUser);

module.exports = router;