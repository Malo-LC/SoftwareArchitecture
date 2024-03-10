const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const QRCode = sequelize.define(
  "QRCode",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    type: DataTypes.STRING(255),
    size: DataTypes.INTEGER,
    data: { type: DataTypes.BLOB("long"), allowNull: false },
  },
  { timestamps: false, tableName: "QRCode" },
);

module.exports = QRCode;
