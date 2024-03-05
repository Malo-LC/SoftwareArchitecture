const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./database');

const Command = sequelize.define('Command', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  is_paid: DataTypes.BOOLEAN,
  discount: DataTypes.FLOAT,
  id_user_session: DataTypes.INTEGER,
  id_product: DataTypes.INTEGER,
}, { timestamps: false, tableName: 'Command' });

module.exports = {
  Command
};