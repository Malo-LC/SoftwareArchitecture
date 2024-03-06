const { Alley } = require("../models/Alley");

async function createAlleyDataSample() {
  try {
    Alley.create({ name: "Route 66" });
    Alley.create({ name: "Champs Elysee" });
    Alley.create({ name: "Time square" });
  } catch (error) {
    console.error("Unable to create alley data sample:", error);
  }
}

module.exports = { createAlleyDataSample };
