const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./database');

const User_Session = sequelize.define('User_Session', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_user: DataTypes.INTEGER,
  id_session: DataTypes.INTEGER,
}, { timestamps: false, tableName: 'User_Session' });

const createUserSession = async (id_user, id_session) => {
  try {
    return await User_Session.create({ id_user, id_session });
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = {
  User_Session,
  createUserSession
};