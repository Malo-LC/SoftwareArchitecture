const router = require("express").Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcryptjs");

const { createNewUser, getUserByEmail, isUserAlreadyExists } = require("../database/users");
const { Token, createNewToken } = require("../database/token");

const emailRegex = /\S+@\S+\.\S+/;

// Register route
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  console.log("register");
  console.log(req.body);

  // Check if email is valid
  if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email", email: email });

  // Check if password and name are valid
  if (password.length < 5) return res.status(400).json({ message: "Password must be at least 5 characters long" });
  if (username.length < 3) return res.status(400).json({ message: "Username must be at least 3 characters long" });

  // Check if user already exists
  const isUserExists = await isUserAlreadyExists(email);
 
  if (isUserExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash passwords
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const role = "customer";

  createNewUser(username, email, hashedPassword, role);

  res.status(201).json(
    {
      message: "User created",
      user: {
        username: username,
        email: email
      }
    }
  );
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if email is valid
  if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email", email: email });

  // Check if password are valid
  if (password.length < 5) return res.status(400).json({ message: "Password must be at least 5 characters long" });

  // Retrieve user by email if exists
  const user = await getUserByEmail(email);
  console.log("login");
  console.log(user);
  if (!user) return res.status(404).json({ message: "Invalid credentials" });

  // Validate credentials
  if (email !== user.email || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = createNewToken(user);

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
