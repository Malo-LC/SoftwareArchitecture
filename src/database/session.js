const sessions = [];

const findSessionById = (id) => sessions.find((session) => session.id === id);

const findSessionByUserId = (userId) => sessions.find((session) => session.userId === userId);

const createSession = (userId) => {
  const session = { id: sessions.length + 1, ownerUserId: userId, users: [userId], qrCode: "" };
  sessions.push(session);
  return session;
};

const joinSession = (id, userId) => {
  const session = findSessionById(id);
  session.users.push(userId);
};

const leaveSession = (id, userId) => {
  const session = findSessionById(id);
  const userIndex = session.users.findIndex((user) => user === userId);
  session.users.splice(userIndex, 1);
};

const deleteSession = (id) => {
  const sessionIndex = sessions.findIndex((session) => session.id === id);
  sessions.splice(sessionIndex, 1);
};

module.exports = {
  findSessionById,
  findSessionByUserId,
  createSession,
  deleteSession,
  joinSession,
  leaveSession,
};
