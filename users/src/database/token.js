const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./database');

const Token = sequelize.define('Token', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    token: { type: DataTypes.STRING(255), allowNull: false },
    active: DataTypes.BOOLEAN,
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    finished_at: DataTypes.DATE,
    life_time: DataTypes.INTEGER,
    id_user: DataTypes.INTEGER,
  }, { timestamps: false });

  module.exports = { Token };

