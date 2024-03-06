const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Product = sequelize.define(
  "Product",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: DataTypes.STRING(255),
    price: DataTypes.FLOAT,
    inventory: { type: DataTypes.INTEGER, defaultValue: 0 },
    type: DataTypes.ENUM("snak", "soft_drink", "alcohol", "food"),
    park_id: DataTypes.INTEGER,
  },
  { timestamps: false, tableName: "Product" },
);

module.exports = Product;
