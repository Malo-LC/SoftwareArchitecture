require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(morgan("dev"));
app.use(helmet());

// Routes
app.post("/", async (req, res) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ message: "Unauthorized", ok: false });
  }

  const { userName, email, value } = req.body;
  if (!userName || !email || !value) return res.status(400).json({ message: "Missing parameters", ok: false });

  const mailOptions = {
    from: "malo.le.corvec@efrei.net",
    to: email,
    subject: "Successful paiement",
    html: `<h1>Thank you ${userName} for your purchase</h1>
    <p>Here is your purchase details:</p>
    <p>${value}</p>`,
  };

  console.log("sending mail...", mailOptions);

  try {
    // TODO: uncomment this line when you want to send the email
    // await sgMail.send(mailOptions);
    console.log("Email sent !");
    return res.status(200).json({ message: "Email sent", ok: true });
  } catch (error) {
    console.log(error.response.body);
    return res.status(500).json({ message: "Internal server error", ok: false });
  }
});

app.listen(process.env.EMAILS_API_PORT || 5500, () =>
  console.log(`Server running on http://${process.env.EMAILS_API_HOST || localhost}:${process.env.EMAILS_API_PORT || 5500}`),
);
