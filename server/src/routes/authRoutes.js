const express = require("express");
const router = express.Router();
const { login, sendOTP, signup ,sendResetOTP, resetPassword} = require("../controllers/authController");

router.post("/login", login);
router.post('/send-otp', sendOTP);
router.post('/signup', signup); 
router.post("/send-reset-otp", sendResetOTP);
router.post("/reset-password", resetPassword);

module.exports = router;