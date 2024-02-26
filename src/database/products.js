const products = [
  {
    id: 1,
    parkId: 1,
    name: "Bowling Game",
    price: 100,
    type: "bowling",
  },
  {
    id: 2,
    parkId: 1,
    name: "Drink",
    price: 200,
    type: "snack",
  },
  {
    id: 3,
    parkId: 1,
    name: "Snack",
    price: 300,
    type: "snack",
  },
  {
    id: 4,
    parkId: 1,
    name: "French fries",
    price: 400,
    type: "snack",
  },
  {
    id: 5,
    parkId: 1,
    name: "Crisps",
    price: 500,
    type: "snack",
  },
];

const findBowlingByParkId = (parkId) =>
  products.find((product) => product.parkId === parkId && product.type === "bowling");

const findProductByIdAndParkId = (parkId, productId) =>
  products.find((product) => product.parkId === parkId && product.id === productId);

module.exports = {
  findBowlingByParkId,
  findProductByIdAndParkId,
};
