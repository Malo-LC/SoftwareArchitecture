const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Alley = sequelize.define(
  "Alley",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: DataTypes.STRING(255),
    qrcode: DataTypes.STRING(255),
    is_used: DataTypes.BOOLEAN,
    id_park: DataTypes.INTEGER,
  },
  { timestamps: false, tableName: "Alley" },
);

module.exports = Alley;
