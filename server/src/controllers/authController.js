const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/mailer");

let otpStore = {};

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = {
      otp,
      expires: Date.now() + 300000
    };

    await transporter.sendMail({
      from: '"BlogVerse Security" <no-reply@blogverse.com>',
      to: email,
      subject: "Verification Code for BlogVerse",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px;">
          <h2 style="color: #1e293b; text-align: center;">Verify Your Identity</h2>
          <p style="color: #475569; font-size: 16px;">Welcome to BlogVerse. Use the following code to complete your registration:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: 900; letter-spacing: 5px; color: #4f46e5; background: #f5f3ff; padding: 10px 20px; border-radius: 8px;">${otp}</span>
          </div>
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">This code will expire in 5 minutes.</p>
        </div>
      `,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending email" });
  }
};

exports.sendResetOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = {
      otp,
      expires: Date.now() + 300000
    };

    await transporter.sendMail({
      from: '"BlogVerse Security" <no-reply@blogverse.com>',
      to: email,
      subject: "Password Reset Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px;">
          <h2 style="color: #1e293b; text-align: center;">Reset Your Password</h2>
          <p style="color: #475569; font-size: 16px;">Use the following code to reset your BlogVerse account password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: 900; letter-spacing: 5px; color: #ef4444; background: #fef2f2; padding: 10px 20px; border-radius: 8px;">${otp}</span>
          </div>
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">This code will expire in 5 minutes.</p>
        </div>
      `,
    });

    res.status(200).json({ message: "Reset code sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending email" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const record = otpStore[email];
    if (!record || record.otp !== parseInt(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > record.expires) {
      delete otpStore[email];
      return res.status(400).json({ message: "OTP expired" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    delete otpStore[email];

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ message: "All fields and OTP are required" });
    }

    const record = otpStore[email];
    if (!record || record.otp !== parseInt(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > record.expires) {
      delete otpStore[email];
      return res.status(400).json({ message: "OTP expired" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    delete otpStore[email];

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "12d" });
    
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        savedBlogs: user.savedBlogs 
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};