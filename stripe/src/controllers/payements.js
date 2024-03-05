const router = require("express").Router();
const { game1, game2 } = require("../database/payements");
const apiSessions = require("../utils/apiSessions");
const passport = require("passport");
console.log(process.env.STRIPE);

const calculateRemainingAmount = (amount, maxAmount) => {
    return maxAmount - amount;
}

router.post("/", async (req, res) => {
    const Stripe = require("stripe");
    const stripe = Stripe(process.env.STRIPE);

    let maxAmount = game1.amount; // Remplacez ceci par le montant total de la partie
    const amountToCharge = 500; // Remplacez ceci par le montant que vous voulez charger

    let remainingAmount = calculateRemainingAmount(amountToCharge, maxAmount);

    if (remainingAmount < 0) {
        return res.status(400).json({ message: `Le montant est trop élevé, il reste ${maxAmount} à payer` });
    }

    const charge = await stripe.paymentIntents.create({
        amount: amountToCharge,
        currency: 'usd',
        automatic_payment_methods: {
            enabled: true
        }
    });

    maxAmount = remainingAmount;

    console.log("Restant à payer : " + maxAmount);

    res.json({ charge });
}, passport.authenticate("jwt", { session: false }));

module.exports = router;