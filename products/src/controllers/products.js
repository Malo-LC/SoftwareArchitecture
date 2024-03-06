const passport = require("passport");
const apiSessions = require("../utils/apiSessions");
const router = require("express").Router();
const Product = require("../models/Products");

router.get("/", passport.authenticate(["user", "admin"], { session: false }), (req, res) => {
  const parkId = parseInt(req.query.parkId, 10);
  const products = Product.findAll({ where: { park_id: parkId } });

  res.status(200).json({ ok: true, products });
});

router.post("/", passport.authenticate(["admin"], { session: false }), async (req, res) => {
  const { parkId, name, price, type } = req.body;

  if (!parkId || !name || !price || !type) {
    return res.status(400).json({ message: "All fields are required", ok: false });
  }
  const product = await Product.create({ park_id: parkId, name, price, type });

  res.status(200).json({ ok: true, product });
});

router.put("/:productId", passport.authenticate(["admin"], { session: false }), async (req, res) => {
  const productId = req.params.productId;
  const { name, price, type } = req.body;

  if (!productId || !name || !price || !type) {
    return res.status(400).json({ message: "All fields are required", ok: false });
  }

  const updated = await Product.update({ name, price, type }, { where: { id: productId } });
  if (!updated) return res.status(400).json({ message: "Product not found", ok: false });

  res.status(200).json({ message: "Product updated", ok: true });
});

router.get("/getCatalogForQRCode", passport.authenticate(["user", "admin"], { session: false }), async (req, res) => {
  const qrCode = req.query.qrCode;
  const park = await apiSessions.get(`/park/${qrCode}`);

  if (!park.ok) return res.status(400).json({ message: park.message, ok: false });
  const products = await Product.findAll({ where: { park_id: park.park.id } });

  res.status(200).json({ ok: true, products });
});

router.get("/findProductByIdAndParkId", passport.authenticate(["service"], { session: false }), async (req, res) => {
  const parkId = req.query.parkId;
  const productId = req.query.productId;

  if (!parkId || !productId) return res.status(400).json({ message: "Park ID & Product ID are required", ok: false });

  const product = await Product.findOne({ where: { id: productId, park_id: parkId } });
  if (!product) return res.status(400).json({ message: "Product not found", ok: false });

  res.status(200).json({ ok: true, product });
});

router.delete("/:productId", passport.authenticate(["admin"], { session: false }), async (req, res) => {
  const productId = req.params.productId;
  if (!productId) return res.status(400).json({ message: "Product ID is required", ok: false });

  const deleted = await Product.destroy({ where: { id: productId } });
  if (!deleted) return res.status(400).json({ message: "Product not found", ok: false });

  res.status(200).json({ message: "Product deleted", ok: true });
});

module.exports = router;
