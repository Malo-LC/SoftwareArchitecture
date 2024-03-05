const { sequelize, User } = require('./database');

// Create new user table
const createNewUser = async (username, email, password, role) => {
  try {
    const user = await User.create({ username: username, email: email, password: password, role: role});
    console.log(`User "${username}", "${email}", "${password}", "${role}" has been created.`);
  } catch (error) {
    console.error(`Unable to create user "${username}", "${email}", "${password}", "${role}":`, error);
  }
};

// Retunr all user data
const getAllUsers = async () => {
  User.findAll().then(users => {
    if (users.length > 0) {
      const usersData = users.map(user => user.toJSON());
      console.log('Liste des utilisateurs:', usersData);
      return usersData;
    } else {
      console.log('Aucun utilisateur trouvé.');
      return null;
    }
  }).catch(error => {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return null;
  });
};

const userAlreadyExists = async (email) => {
  User.findAll({
    where: {
      email: email,
    }
  }).then((user) => {
    if (user.length > 0) {
      return true;
    } else {
      return false;
    }
  }).catch(error => {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return false;
  });
}


module.exports = { createNewUser, getAllUsers, userAlreadyExists };
