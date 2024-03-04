require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE);
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');

// Create an instance of Express
const app = express();
require('./passport')(app);

// Configure middleware to parse JSON requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb'}));
app.use(morgan('dev'));
app.use(helmet());

// Routes
app.use("/payements", require("./controllers/payements"))

// Start the server
app.listen(7000, () => {
    console.log('Server started on port 7000');
});