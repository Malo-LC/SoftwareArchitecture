require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const { testDatabaseConnection, syncSequelize } = require("./database");

const app = express();

require("./passport")(app);

// Tester la connexion à la base de données
testDatabaseConnection();
syncSequelize();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(morgan("dev"));
app.use(helmet());

// Routes
app.use(require("./controllers/session"));

app.listen(process.env.SESSIONS_API_PORT || 5200, () =>
  console.log(
    `Server running on http://${process.env.SESSIONS_API_HOST || "localhost"}:${process.env.SESSIONS_API_PORT || 5200}`,
  ),
);
