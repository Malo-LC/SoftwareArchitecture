const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./database');

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

// Create new user table
const createNewUser = (username, email, password, role) => {
  try {
    const user = User.create({ username: username, email: email, password: password, role: role});
    console.log(`User "${username}", "${email}", "${password}", "${role}" has been created.`);
  } catch (error) {
    console.error(`Unable to create user "${username}", "${email}", "${password}", "${role}":`, error);
  }
};

// Return user data by email
const getUserByEmail = async (email) => {
  try {
    const users = await User.findAll({
      where: {
        email: email,
      }
    });

    if (users.length > 0) {
      return users[0].toJSON();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return null;
  }
};

// Retunr all user data
const getAllUsers = async () => {
  try {
    const users = await User.findAll();

    if (users.length > 0) {
      const usersData = users.map(user => user.toJSON());
      console.log('Liste des utilisateurs:', usersData);
      return usersData;
    } else {
      console.log('Aucun utilisateur trouvé.');
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return null;
  }
};

// Check if user already exists
const isUserAlreadyExists = async (email) => {
  try {
    const user = await User.findAll({
      where: {
        email: email,
      }
    });
    return user.length > 0;
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return false;
  }
}


module.exports = { createNewUser, getAllUsers, isUserAlreadyExists, getUserByEmail };
