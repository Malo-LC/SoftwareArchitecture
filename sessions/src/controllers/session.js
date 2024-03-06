const router = require("express").Router();
const passport = require("passport");

const Alley = require("../models/Alley");
const Bill = require("../models/Bill");
const Command = require("../models/Command");
const Session = require("../models/Session");
const UserSession = require("../models/UserSession");
const apiProducts = require("../utils/apiProducts");
const Park = require("../models/Park");

const findSessionByQrCode = async (qrCode) => {
  const alley = await Alley.findOne({ where: { qrCode } });
  if (!alley) return null;
  const session = await Session.findOne({ where: { id_alley: alley.id } });
  return session;
};

// Join a session by QR Code, if the session does not exist, create a new one
router.post("/join/:qrCode", passport.authenticate(["admin"], { session: false }), async (req, res) => {
  const qrCode = req.params.qrCode;
  if (!qrCode) return res.status(400).json({ message: "QR Code is required", ok: false });

  const alley = await Alley.findOne({ where: { qrCode } });
  if (!alley) return res.status(400).json({ message: "Alley not found", ok: false });

  let session = await Session.findOne({ where: { id_alley: alley.id } });
  if (!session) {
    session = await Session.create({ id_alley: alley.id, active: false });
    const userSession = await UserSession.create({ id_user: req.user.id, id_session: session.id });
    await Bill.create({ id_user_session: userSession.id, amount: 15 });
  } else {
    const userSessionAlreadyExists = await UserSession.findOne({
      where: { id_user: req.user.id, id_session: session.id },
    });
    if (userSessionAlreadyExists) return res.status(400).json({ message: "User already in session", ok: false });
    const userSession = await UserSession.create({ id_user: req.user.id, id_session: session.id });

    const bill = await Bill.findOrCreate({ where: { id_user_session: userSession.id } });
    if (bill.is_paid) return res.status(400).json({ message: "Session already paid", ok: false });
    Bill.update({ amount: bill.amount + 15 }, { where: { id_user_session: userSession.id } });
  }

  res.status(200).json({ message: "User joined the alley's session", ok: true });
});

router.get("/", passport.authenticate(["user", "admin"], { session: false }), async (req, res) => {
  const sessions = await Session.findAll();
  res.status(200).json({ ok: true, sessions });
});

router.get("/park/:qrCode", passport.authenticate(["service"], { session: false }), async (req, res) => {
  const qrCode = req.params.qrCode;
  if (!qrCode) return res.status(400).json({ message: "QR Code is required", ok: false });

  const session = await findSessionByQrCode(qrCode);
  if (!session) return res.status(400).json({ message: "Session not found", ok: false });

  const alley = await Alley.findOne({ where: { id: session.id_alley } });
  const park = await Park.findOne({ where: { id: alley.id_park } });

  res.status(200).json({ ok: true, park });
});

router.post("/order/:qrCode", passport.authenticate(["user", "admin"], { session: false }), async (req, res) => {
  const user = req.user;
  const qrCode = req.params.qrCode;
  if (!qrCode) return res.status(400).json({ message: "QR Code is required", ok: false });

  const productId = parseInt(req.query.productId, 10);
  if (!productId) return res.status(400).json({ message: "Product ID is required", ok: false });

  const session = await findSessionByQrCode(qrCode);
  if (!session) return res.status(400).json({ message: "Session not found", ok: false });
  const userSession = await UserSession.findOne({ where: { id_user: user.id, id_session: session.id } });
  if (!userSession) return res.status(400).json({ message: "User not in session", ok: false });

  const alley = await Alley.findOne({ where: { id: session.id_alley } });
  if (!alley) return res.status(400).json({ message: "Alley not found", ok: false });
  const product = await apiProducts.get(`/findProductByIdAndParkId?parkId=${alley.id_park}&productId=${productId}`);
  if (!product) return res.status(400).json({ message: "Product not found", ok: false });

  const command = await Command.create({
    id_user_session: userSession.id,
    id_product: product.id,
  });

  let bill = await Bill.findOne({ where: { id_user_session: userSession.id } });
  bill = await Bill.update({ amount: bill.amount + product.price }, { where: { id_user_session: userSession.id } });

  res.status(200).json({ message: "Product order done", ok: true, command, bill });
});

router.post("/payment/:qrCode", passport.authenticate(["user", "admin"], { session: false }), async (req, res) => {
  const user = req.user;
  const amount = parseInt(req.query.amount, 10);
  const qrCode = req.params.qrCode;
  if (!amount) return res.status(400).json({ message: "Amount is required", ok: false });

  const session = await findSessionByQrCode(qrCode);
  if (!session) return res.status(400).json({ message: "Session not found", ok: false });
  const userSession = await UserSession.findOne({ where: { id_user: user.id, id_session: session.id } });
  if (!userSession) return res.status(400).json({ message: "User not in session", ok: false });
  const bill = await Bill.findOne({ where: { id_user_session: userSession.id } });
  if (!bill) return res.status(400).json({ message: "Bill not found", ok: false });
  if (bill.amount < amount) return res.status(400).json({ message: "Amount is too high", ok: false });

  bill.amount = bill.amount - amount;
  if (bill.amount === 0) {
    bill.is_paid = true;
    const session = await Session.findOne({ where: { id: userSession.id_session } });
    session.active = true;
    await session.save();
  }
  await bill.save();

  res.status(200).json({ message: "Payment done", ok: true, bill });
});

module.exports = router;
