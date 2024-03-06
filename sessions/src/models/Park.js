const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Park = sequelize.define(
  "Park",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: DataTypes.STRING(255),
    address: DataTypes.STRING(255),
  },
  { timestamps: false, tableName: "Park" },
);

module.exports = Park;
