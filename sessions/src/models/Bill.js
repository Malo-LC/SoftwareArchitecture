const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Bill = sequelize.define(
  "Bill",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    amount: { type: DataTypes.FLOAT, defaultValue: 0 },
    is_paid: { type: DataTypes.BOOLEAN, defaultValue: false },
    id_user_session: DataTypes.INTEGER,
  },
  { timestamps: false, tableName: "Bill" },
);

module.exports = Bill;
