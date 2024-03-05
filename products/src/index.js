require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");

const app = express();
require("./passport")(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(morgan("dev"));
app.use(helmet());

// Routes
app.use(require("./controllers/products"));

app.listen(process.env.PRODUTS_API_PORT || 3000, () =>
  console.log(`Server running on http://${process.env.PRODUTS_API_HOST || localhost}:${process.env.PRODUTS_API_PORT || 3000}`),
);

// Database connection
const { testDatabaseConnection, syncSequelize } = require('./database/database');

// Tester la connexion à la base de données
testDatabaseConnection();
syncSequelize();