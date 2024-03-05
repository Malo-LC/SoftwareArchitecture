const { Sequelize } = require('sequelize');
const { DataTypes } = Sequelize;

database = process.env.MYSQL_DATABASE;
username = 'root';
password = process.env.MYSQL_PASSWORD;
host = process.env.MYSQL_HOST;
port = process.env.MYSQL_PORT;

const sequelize = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: 'mysql',
});

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true, // Enforce unique username
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true, // Enforce unique email
    validate: {
      isEmail: true, // Validate email format (optional)
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    // Consider using secure hashing/salting for password storage
  },
  role: {
    type: DataTypes.ENUM('agent', 'customer'),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  timestamps: false,
  tableName: 'User',
});

const Token = sequelize.define('Token', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  token: { type: DataTypes.STRING(255), allowNull: false },
  active: DataTypes.BOOLEAN,
  created_at: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
  finished_at: DataTypes.DATE,
  life_time: DataTypes.INTEGER,
  id_user: DataTypes.INTEGER,
}, { timestamps: false });

async function syncSequelize() {
  try {
    await sequelize.sync();
    console.log('Sequelize synchronized.');
  } catch (error) {
    console.error('Unable to sync Sequelize:', error);
  }
}

async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données réussie.');
  } catch (error) {
    console.error('Impossible de se connecter à la base de données:', error);
  }
}

module.exports = { sequelize, User, Token, testDatabaseConnection, syncSequelize };
