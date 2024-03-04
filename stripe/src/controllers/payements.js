const router = require("express").Router();
const apiSessions = require("../utils/apiSessions");
const passport = require("passport");
console.log(process.env.STRIPE);

router.post("/", async (req, res) => {
    const Stripe = require("stripe");
    const stripe = Stripe(process.env.STRIPE);
    const { amount, currency, source, description } = req.body;
    const charge = await stripe.paymentIntents.create({
        amount,
        currency,
        description,
        confirm: true,
        payment_method: 'pm_1MqLiJLkdIwHu7ixUEgbFdYF',
        payment_method_types: ['card'],
        return_url: 'https://www.myefrei.fr/'
    });
    res.status(200).json({ ok: true, charge });
});
module.exports = router;