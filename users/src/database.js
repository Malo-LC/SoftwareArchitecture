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

async function syncSequelize() {
  try {
    await sequelize.sync();
    console.log("Sequelize synchronized.");
  } catch (error) {
    console.error("Unable to sync Sequelize:", error);
  }
}

async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connexion à la base de données réussie.");
  } catch (error) {
    console.error("Impossible de se connecter à la base de données:", error);
  }
}

module.exports = { sequelize, testDatabaseConnection, syncSequelize };
