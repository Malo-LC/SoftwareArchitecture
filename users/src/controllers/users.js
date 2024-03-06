const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");

const { createNewUser, getUserByEmail, emailAlreadyExists, User } = require("../models/Users");
const { createToken } = require("../utils/token");

const emailRegex = /\S+@\S+\.\S+/;

// Register route
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: "Missing fields", ok: false });

  // Check if email is valid
  if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email", email });

  // Check if password and name are valid
  if (password.length < 5) {
    return res.status(400).json({ message: "Password must be at least 5 characters long", ok: false });
  }
  if (username.length < 3) {
    return res.status(400).json({ message: "Username must be at least 3 characters long", ok: false });
  }

  // Check if user already exists
  const userExists = await emailAlreadyExists(email);

  if (userExists) {
    return res.status(400).json({ message: "User already exists", ok: false });
  }

  // Hash passwords
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const role = "customer";

  const user = await createNewUser(username, email, hashedPassword, role);

  res.status(201).json({
    message: "User created",
    user: {
      username: user.username,
      email: user.email,
    },
    ok: true,
  });
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: "Missing fields", ok: false });

  // Retrieve user by email if exists
  const user = await getUserByEmail(email);
  if (!user) return res.status(401).json({ message: "Invalid credentials", ok: false });

  // Validate credentials
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Invalid credentials", ok: false });
  }

  const token = createToken(user);

  res.status(200).json({ token, ok: true });
});

// Does not work with the new database
router.get("/admin", passport.authenticate(["service"], { session: false }), (req, res) => {
  const id = parseInt(req.query.id, 10);
  if (!id) return res.status(401).json({ message: "Unauthorized", ok: false });
  const user = User.findOne({ where: { id } });
  if (!user) return res.status(401).json({ message: "Unauthorized", ok: false });
  res.status(200).json({ ok: true, user });
});

// Does not work with the new database
router.get("/user", passport.authenticate(["service"], { session: false }), (req, res) => {
  const id = parseInt(req.query.id, 10);
  if (!id) return res.status(401).json({ message: "Unauthorized", ok: false });
  const user = User.findOne({ where: { id, role: "agent" } });
  if (!user) return res.status(401).json({ message: "Unauthorized", ok: false });
  res.status(200).json({ ok: true, user });
});

module.exports = router;
