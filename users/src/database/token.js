const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./database');

const Token = sequelize.define('Token', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  token: { type: DataTypes.STRING(255), allowNull: false },
  active: DataTypes.BOOLEAN,
  created_at: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
  finished_at: DataTypes.DATE,
  life_time: DataTypes.INTEGER,
  id_user: DataTypes.INTEGER,
}, { timestamps: false, tableName: 'Token' });

const createNewToken = async (user, token, life_time) => {
  try {
    const created_at = new Date();
    const finished_at = calculateFinishedAt(created_at, life_time);

    const newToken = Token.create({ token: token, active: true, created_at: created_at, finished_at: finished_at, life_time: life_time, id_user: user.id});
    console.log(`Token "${token}" has been created.`);
    return token;
  } catch (error) {
    console.error(`Unable to create token "${token}" for user "${user.email}":`, error);
    return null;
  }
};

const calculateFinishedAt = (created_at, life_time) => {
  // Assurez-vous que life_time est en secondes et convertissez-le en millisecondes
  const lifeTimeInMilliseconds = life_time * 1000;
  const createdAtDate = new Date(created_at);
  const finishedAtDate = new Date(createdAtDate.getTime() + lifeTimeInMilliseconds);

  return finishedAtDate;
};


module.exports = { Token, createNewToken }; 

