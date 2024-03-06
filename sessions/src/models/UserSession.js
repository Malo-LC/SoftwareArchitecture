const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const UserSession = sequelize.define(
  "User_Session",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    id_user: DataTypes.INTEGER,
    id_session: DataTypes.INTEGER,
  },
  { timestamps: false, tableName: "User_Session" },
);

module.exports = UserSession;
