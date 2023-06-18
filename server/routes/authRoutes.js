const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const requireLogin = require('../middleware/requireLogin');

router.post('/login',authController.login);
router.get('/current',requireLogin,authController.currentUser);
router.put('/newpass',requireLogin,authController.newpass);


module.exports = router;