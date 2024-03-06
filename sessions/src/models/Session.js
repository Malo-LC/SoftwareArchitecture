const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Session = sequelize.define(
  "Session",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    active: DataTypes.BOOLEAN,
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    finished_at: DataTypes.DATE,
    id_alley: DataTypes.INTEGER,
  },
  { timestamps: false, tableName: "Session" },
);

module.exports = Session;
