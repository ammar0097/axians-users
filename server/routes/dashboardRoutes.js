const express = require("express");
const router = express.Router();
const dashController = require("../controllers/dashController");
const requireLogin = require('../middleware/requireLogin');
const requireAdmin = require('../middleware/requireAdmin');


router.get('/dashboard',requireLogin,requireAdmin,dashController.getDashboardStats);


module.exports = router;