const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post('/users',userController.createUser);
router.get('/users',userController.getAllUsers);
router.get('/users/:id',userController.getUserById);
router.delete('/users/:id',userController.deleteUser);
router.patch('/users/:id',userController.updateUser);

module.exports = router;