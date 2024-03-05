const router = require("express").Router();
const apiSessions = require("../utils/apiSessions");
const passport = require("passport");
console.log(process.env.STRIPE);

router.post("/", async (req, res) => {
    const Stripe = require("stripe");
    const stripe = Stripe(process.env.STRIPE);
    
    const charge = await stripe.paymentIntents.create({
        amount: 2000,
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
    });
    res.json(charge);
}, passport.authenticate("jwt", { session: false }));
module.exports = router;