const router = require("express").Router();
const passport = require("passport");

const { createSession, getSessions, joinSession, orderProduct, sessionPayment } = require("../utils/apiSessions");
const { ApiUsers } = require("../utils/apiUsers");


const { Alley, getAlleyById, getAlleyByQrCode } = require("../database/alleys");
const { Bill } = require("../database/bill");
const { Command } = require("../database/command");
const { QRCode, getQRCodeById } = require("../database/qrcode");
const { Session, getAvailableSessionByAlley } = require("../database/session");
const { User_Session, createUserSession } = require("../database/UserSession");

// Join a session by QR Code, if the session does not exist, create a new one
router.post("join/:qrCode", passport.authenticate(["admin"], { session: false }), (req, res) => {
  if (!qrCode) return res.status(400).json({ message: "QR Code is required", ok: false });

  const userResponse = ApiUsers.get("/verifytoken"); // This is not working à finir
  if (!userResponse.ok) return res.status(400).json({ message: userResponse.message, ok: false });
  const user = userResponse.user;

  const alley = getAlleyByQrCode(qrCode);
  if (!alley) return res.status(400).json({ message: "Alley not found", ok: false });

  let session = getAvailableSessionByAlley(alley.id);
  if (!session) {
    session = createSession(user.id, alley.id);
    console.log("Session created for alley: ", alley.id);
  }
  
  const userSession = User_Session.create({ id_user: user.id, id_session: session.id });
  if (!userSession) return res.status(400).json({ message: "User session not created", ok: false });
  console.log("User joined session: ", session.id);

  res.status(200).json({ message: "User join the alley's session", ok: true, alley: alley, session: session.id });
});

router.post("/", passport.authenticate(["user", "admin"], { session: false }), async (req, res) => {
  const user = req.user;
  const parkId = parseInt(req.query.parkId, 10);
  if (!parkId) return res.status(400).json({ message: "Park ID is required", ok: false });
  const session = await createSession(user.id, parkId);
  if (!session) return res.status(400).json({ message: "No free alley available", ok: false });
  res.status(200).json({ message: "Session created", ok: true, session });
});

router.get("/", passport.authenticate(["user", "admin"], { session: false }), (req, res) => {
  const sessions = getSessions();
  res.status(200).json({ ok: true, sessions });
});

router.get("/qrCode/:qrCode", passport.authenticate(["service"], { session: false }), (req, res) => {
  const sessions = getSessions();
  const qrCode = req.params.qrCode;
  if (!qrCode) return res.status(400).json({ message: "QR Code is required", ok: false });
  const session = sessions.find((session) => session.qrCode === qrCode);
  if (!session) return res.status(400).json({ message: "Session not found", ok: false });
  res.status(200).json({ ok: true, session });
});

router.post("/join/:qrCode", passport.authenticate(["admin"], { session: false }), (req, res) => {
  const user = req.user;
  const parkId = parseInt(req.query.parkId, 10);
  const qrCode = req.params.qrCode;
  if (!parkId || !qrCode) return res.status(400).json({ message: "Park ID & qrCode are required", ok: false });
  const session = joinSession(qrCode, user.id, parkId);
  if (!session) return res.status(400).json({ message: "Session not found", ok: false });
  res.status(200).json({ message: "Session joined", ok: true, session });
});

router.post("/order/:qrCode", passport.authenticate(["user", "admin"], { session: false }), async (req, res) => {
  const user = req.user;
  const qrCode = req.params.qrCode;
  if (!qrCode) return res.status(400).json({ message: "QR Code is required", ok: false });
  const productId = parseInt(req.query.productId, 10);
  if (!productId) return res.status(400).json({ message: "Product ID is required", ok: false });
  const session = await orderProduct(qrCode, user.id, productId);
  if (!session) return res.status(400).json({ message: "Session not found", ok: false });
  res.status(200).json({ message: "Product order done", ok: true, session });
});

router.post("/payment/:qrCode", passport.authenticate(["user", "admin"], { session: false }), (req, res) => {
  const user = req.user;
  const amount = parseInt(req.query.amount, 10);
  const qrCode = req.params.qrCode;
  if (!amount) return res.status(400).json({ message: "Amount is required", ok: false });
  const session = sessionPayment(qrCode, user.id, amount, user.email, user.username);
  if (!session.ok) return res.status(400).json({ message: session.message, ok: false });
  res.status(200).json({ message: "Payment done", ok: true, session: session.session });
});

module.exports = router;
