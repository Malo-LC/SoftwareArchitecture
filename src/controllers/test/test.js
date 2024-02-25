const router = require("express").Router();
const passport = require("passport");

// Protected route (middleware checks for JWT)
router.get("/protected", passport.authenticate(["user", "admin"], { session: false }), (req, res) => {
  res.status(200).json({ message: "Welcome, " + req.user.username });
});

// Admin-only route (middleware checks for admin role)
router.get("/admin", passport.authenticate(["admin"], { session: false }), (req, res) => {
  res.status(200).json({ message: "Welcome, admin!" });
});

module.exports = router;
