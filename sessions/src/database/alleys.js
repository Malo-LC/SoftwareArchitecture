const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./database');

const Alley = sequelize.define('Alley', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: DataTypes.STRING(255),
  id_qrcode: DataTypes.INTEGER,
}, { timestamps: false, tableName: 'Alley' });

module.exports = { 
  Alley
};