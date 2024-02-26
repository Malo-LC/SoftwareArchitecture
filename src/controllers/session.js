const router = require("express").Router();
const passport = require("passport");
const { createSession, getSessions, joinSession, sessionPayment, orderProduct } = require("../database/session");

router.post("/", passport.authenticate(["user", "admin"], { session: false }), (req, res) => {
  const user = req.user;
  const parkId = parseInt(req.query.parkId, 10);
  if (!parkId) return res.status(400).json({ message: "Park ID is required", ok: false });
  const session = createSession(user.id, parkId);
  if (!session) return res.status(400).json({ message: "No free alley available", ok: false });
  res.status(200).json({ message: "Session created", ok: true, session });
});

router.get("/", passport.authenticate(["user", "admin"], { session: false }), (req, res) => {
  const sessions = getSessions();
  res.status(200).json({ ok: true, sessions });
});

router.post("/join/:orderId", passport.authenticate(["admin"], { session: false }), (req, res) => {
  const user = req.user;
  const parkId = parseInt(req.query.parkId, 10);
  const orderId = parseInt(req.params.orderId, 10);
  if (!parkId || !orderId) return res.status(400).json({ message: "Park ID & orderId are required", ok: false });
  const session = joinSession(orderId, user.id, parkId);
  if (!session) return res.status(400).json({ message: "Session not found", ok: false });
  res.status(200).json({ message: "Session joined", ok: true, session });
});

router.post("/order/:orderId", passport.authenticate(["user", "admin"], { session: false }), (req, res) => {
  const user = req.user;
  const orderId = parseInt(req.params.orderId, 10);
  if (!orderId) return res.status(400).json({ message: "Order ID is required", ok: false });
  const productId = parseInt(req.query.productId, 10);
  const parkId = parseInt(req.query.parkId, 10);
  if (!productId || !parkId) return res.status(400).json({ message: "Product ID & park ID are required", ok: false });
  const session = orderProduct(orderId, user.id, productId, parkId);
  if (!session) return res.status(400).json({ message: "Session not found", ok: false });
  res.status(200).json({ message: "Product order done", ok: true, session });
});

router.post("/payment/:orderId", passport.authenticate(["user", "admin"], { session: false }), (req, res) => {
  const user = req.user;
  const amount = parseInt(req.query.amount, 10);
  const orderId = parseInt(req.params.orderId, 10);
  if (!amount) return res.status(400).json({ message: "Amount is required", ok: false });
  const session = sessionPayment(orderId, user.id, amount);
  if (!session.ok) return res.status(400).json({ message: session.message, ok: false });
  res.status(200).json({ message: "Payment done", ok: true, session: session.session });
});

module.exports = router;
