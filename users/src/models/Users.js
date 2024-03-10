const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const User = sequelize.define(
  "User",
  {
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
      type: DataTypes.ENUM("agent", "customer"),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "User",
  },
);

// Create new user table
const createNewUser = async (username, email, password, role) => {
  try {
    const user = await User.create({ username, email, password, role });
    return user;
  } catch (error) {
    console.error(`Unable to create user "${username}", "${email}", "${password}", "${role}":`, error);
  }
};

const getUserById = async (id) => {
  try {
    const user = await User.findByPk(id);
    return user || null;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return null;
  }
};

// Return user data by email
const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    return user || null;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return null;
  }
};

// Retunr all user data
const getAllUsers = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return null;
  }
};

// Check if user already exists
const emailAlreadyExists = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    return !!user;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return false;
  }
};

module.exports = { createNewUser, getAllUsers, emailAlreadyExists, getUserById, getUserByEmail, User };
