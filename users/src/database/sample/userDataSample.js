const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../database');
const { User } = require('../users');
const bcrypt = require("bcryptjs");

async function createUserDataSample() {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    User.create({ username: 'hugo', email: 'hugo@efrei.net', password: hashedPassword, role: "agent" });
    User.create({ username: 'jacques', email: 'jacques@efrei.net', password: hashedPassword, role: "customer" });
  } catch (error) {
    console.error('Unable to create user data sample:', error);
  }
}

module.exports = { createUserDataSample };