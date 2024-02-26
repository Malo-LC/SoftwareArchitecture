const { findFreeAlley } = require("./alleys");
const { findBowlingByParkId, findProductByIdAndParkId } = require("./products");
const sessions = [];

const findSessionById = (id) => sessions.find((session) => session.id === id);

const findSessionIndexById = (id) => sessions.findIndex((session) => session.id === id);

const createSession = (userId, parkId) => {
  const alley = findFreeAlley(parkId);
  if (!alley) return false;
  const bowlingSession = findBowlingByParkId(parkId);
  if (!bowlingSession) return false;
  const session = {
    id: sessions.length + 1,
    ownerUserId: userId,
    users: [userId],
    parkId,
    cartTotal: bowlingSession.price,
    cart: [bowlingSession.id],
    cartRemaingAmount: bowlingSession.price,
    isStarted: false,
    qrCode: alley.qrCode,
  };
  sessions.push(session);
  return session;
};

const joinSession = (orderId, userId, parkId) => {
  const session = findSessionById(orderId);
  if (!session) return false;
  if (session.users.includes(userId)) return false;
  const bowlingSession = findBowlingByParkId(parkId);
  if (!bowlingSession) return false;
  const newSession = {
    ...session,
    cartTotal: session.cartTotal + bowlingSession.price,
    cartRemaingAmount: session.cartRemaingAmount + bowlingSession.price,
    cart: [...session.cart, bowlingSession.id],
    users: [...session.users, userId],
  };
  sessions[findSessionIndexById(orderId)] = newSession;
  return newSession;
};

const sessionPayment = (orderId, userId, amount) => {
  const session = findSessionById(orderId);
  if (!session) return false;
  if (session.users.includes(userId)) return false;
  if (amount > session.cartRemaingAmount) return false;
  const newSession = {
    ...session,
    cartRemaingAmount: session.cartRemaingAmount - amount,
    isStarted: session.cartRemaingAmount - amount === 0,
  };
  sessions[findSessionIndexById(orderId)] = newSession;
  return newSession;
};

const orderProduct = (orderId, userId, productId, parkId) => {
  const session = findSessionById(orderId);
  if (!session) return false;
  if (session.users.includes(userId)) return false;
  const product = findProductByIdAndParkId(parkId, productId);
  if (!product) return false;
  const newSession = {
    ...session,
    cartTotal: session.cartTotal + product.price,
    cartRemaingAmount: session.cartRemaingAmount + product.price,
    cart: [...session.cart, product.id],
  };
  sessions[findSessionIndexById(orderId)] = newSession;
  return newSession;
};

const deleteSession = (id) => {
  const orderIndex = sessions.findIndex((session) => session.id === id);
  sessions.splice(orderIndex, 1);
};

module.exports = {
  findSessionById,
  createSession,
  deleteSession,
  joinSession,
  sessionPayment,
  orderProduct,
};
