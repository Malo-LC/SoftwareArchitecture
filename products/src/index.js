require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const { testDatabaseConnection } = require("./database");

const app = express();

require("./passport")(app);

// Tester la connexion à la base de données
testDatabaseConnection();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(morgan("dev"));
app.use(helmet());

// Routes
app.use(require("./controllers/products"));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong", ok: false });
});

app.listen(process.env.PRODUTS_API_PORT || 5100, () =>
  console.log(
    `Server running on http://${process.env.PRODUTS_API_HOST || "localhost"}:${process.env.PRODUTS_API_PORT || 5100}`,
  ),
);
