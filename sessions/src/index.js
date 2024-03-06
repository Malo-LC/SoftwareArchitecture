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
app.use(require("./controllers/session"));

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render("error", { error: err });
}

// Global error handler
app.use(errorHandler);
app.listen(process.env.SESSIONS_API_PORT || 5200, () =>
  console.log(
    `Server running on http://${process.env.SESSIONS_API_HOST || "localhost"}:${process.env.SESSIONS_API_PORT || 5200}`,
  ),
);
