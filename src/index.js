require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require("./passport")(app);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/users", require("./controllers/users"));
app.use("/session", require("./controllers/session"));
app.use("/products", require("./controllers/products"));

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`),
);
