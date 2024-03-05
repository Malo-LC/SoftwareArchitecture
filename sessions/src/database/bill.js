const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./database');

const Bill = sequelize.define('Bill', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  amount: DataTypes.FLOAT,
  is_paid: DataTypes.BOOLEAN,
  id_user_session: DataTypes.INTEGER,
}, { timestamps: false, tableName: 'Bill' });

module.exports = {
  Bill
};