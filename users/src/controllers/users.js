const router = require("express").Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcryptjs");

const users = require("../database/users");

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = users.find((user) => user.email === email);
  if (!user) return res.status(404).json({ message: "Invalid credentials" });

  // Validate credentials
  if (email !== user.email || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const payload = { id: user.id, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

  res.status(200).json({ token });
});

router.get("/admin", passport.authenticate(["session"], { session: false }), (req, res) => {
  const id = parseInt(req.query.id, 10);
  if (!id) return res.status(401).json({ message: "Unauthorized", ok: false });
  const user = users.find((user) => user.id === id && user.role === "admin");
  if (!user) return res.status(401).json({ message: "Unauthorized", ok: false });
  res.status(200).json({ ok: true, user });
});

router.get("/user", passport.authenticate(["session"], { session: false }), (req, res) => {
  const id = parseInt(req.query.id, 10);
  if (!id) return res.status(401).json({ message: "Unauthorized", ok: false });
  const user = users.find((user) => user.id === id && user.role !== "admin");
  if (!user) return res.status(401).json({ message: "Unauthorized", ok: false });
  res.status(200).json({ ok: true, user });
});

module.exports = router;
