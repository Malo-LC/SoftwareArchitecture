const router = require("express").Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcryptjs");

const { createNewUser, getUserById, getUserByEmail, isUserAlreadyExists } = require("../database/users");
const { createToken, verifyToken } = require("../utils/token");

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

  const token = createToken(user);

  res.status(200).json({ token });
});

// Verify token route (protected) for services
router.get("/verifytoken", passport.authenticate(["service"], { session: false }), async (req, res) => {

  const decoded = verifyToken(req.headers.authorization.split(" ")[1]);
  if (!decoded) {
    console.log("Token is invalid");
    return res.status(401).json({ message: "Unauthorized", ok: false });
  } 

  const user = await getUserById(decoded.id);
  delete user.password;

  if (!user) {
    console.log("User not found, giving ID: ", decoded.id);
    return res.status(401).json({ message: "User does not exists", ok: false });
  }

  res.status(200).json({ message: "Token is valid", ok: true, user: user });
});

// Does not work with the new database
router.get("/admin", passport.authenticate(["service"], { session: false }), (req, res) => {
  const id = parseInt(req.query.id, 10);
  if (!id) return res.status(401).json({ message: "Unauthorized", ok: false });
  const user = users.find((user) => user.id === id && user.role === "admin");
  if (!user) return res.status(401).json({ message: "Unauthorized", ok: false });
  res.status(200).json({ ok: true, user });
});

// Does not work with the new database
router.get("/user", passport.authenticate(["service"], { session: false }), (req, res) => {
  const id = parseInt(req.query.id, 10);
  if (!id) return res.status(401).json({ message: "Unauthorized", ok: false });
  const user = users.find((user) => user.id === id && user.role !== "admin");
  if (!user) return res.status(401).json({ message: "Unauthorized", ok: false });
  res.status(200).json({ ok: true, user });
});


module.exports = router;
