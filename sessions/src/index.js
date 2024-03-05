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
app.use(require("./controllers/session"));

app.listen(process.env.SESSIONS_API_PORT || 4000, () =>
  console.log(`Server running on http://${process.env.SESSIONS_API_HOST || localhost}:${process.env.SESSIONS_API_PORT || 4000}`),
);

// Database connection
const { testDatabaseConnection, syncSequelize } = require('./database/database');

// Tester la connexion à la base de données
testDatabaseConnection();
syncSequelize();