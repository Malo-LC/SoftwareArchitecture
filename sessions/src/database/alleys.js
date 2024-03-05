const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./database');

const Alley = sequelize.define('Alley', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: DataTypes.STRING(255),
  id_qrcode: DataTypes.INTEGER,
  id_park: DataTypes.INTEGER,
}, { timestamps: false, tableName: 'Alley' });

const getAlleyById = async (id) => {
  try {
    return await Alley.findByPk(id);
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getAlleyByQrCode = async (id_qrcode) => {
  try {
    return await Alley.findOne({ where: { id_qrcode } });
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = { 
  Alley,
  getAlleyById,
  getAlleyByQrCode
};