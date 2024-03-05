const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../database');
const { Alley } = require('../alleys');
const bcrypt = require("bcryptjs");

async function createAlleyDataSample() {
  try {
    Alley.create({ name: "Route 66" });
    Alley.create({ name: "Champs Elysee" });
    Alley.create({ name: "Time square" });
  } catch (error) {
    console.error('Unable to create alley data sample:', error);
  }
}

module.exports = { createAlleyDataSample };