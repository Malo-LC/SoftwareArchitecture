const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Command = sequelize.define(
  "Command",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    is_paid: { type: DataTypes.BOOLEAN, defaultValue: false },
    discount: { type: DataTypes.FLOAT, defaultValue: 0 },
    id_user_session: DataTypes.INTEGER,
    id_product: DataTypes.INTEGER,
  },
  { timestamps: false, tableName: "Command" },
);

module.exports = Command;
