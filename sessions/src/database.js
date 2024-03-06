const { Sequelize } = require("sequelize");

const database = process.env.MYSQL_DATABASE;
const username = "root";
const password = process.env.MYSQL_PASSWORD;
const host = process.env.MYSQL_HOST;
const port = process.env.MYSQL_PORT;

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect: "mysql",
});

async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ - Connected to database");
  } catch (error) {
    console.error("❌ - Error while connecting to db :", error);
  }
}

module.exports = { sequelize, testDatabaseConnection };
