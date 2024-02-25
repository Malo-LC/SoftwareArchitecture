const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const users = require("../../users");

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
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.status(200).json({ token });
});

module.exports = router;
