const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { makeToken } = require("../middleware/auth");

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", async function (req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "username, email and password are all needed" });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "password must be at least 8 characters" });
  }

  const taken = await User.findOne({ email: email.toLowerCase() });
  if (taken) {
    return res.status(400).json({ message: "that email already has an account" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, passwordHash });

  res.status(201).json({
    token: makeToken(user._id),
    user: { id: user._id, username: user.username, email: user.email },
  });
});

// POST /api/auth/login
router.post("/login", async function (req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email: (email || "").toLowerCase() });
  if (!user) {
    return res.status(400).json({ message: "wrong email or password" });
  }

  const matches = await bcrypt.compare(password || "", user.passwordHash);
  if (!matches) {
    return res.status(400).json({ message: "wrong email or password" });
  }

  res.json({
    token: makeToken(user._id),
    user: { id: user._id, username: user.username, email: user.email },
  });
});

module.exports = router;
