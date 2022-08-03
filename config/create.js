const mongoose = require("mongoose");
const Value = require("../models/Value.js")

const createValue = async () => {
  try {
    const result = await Value.create({
      name: "Incrementor",
      value_index: "1"
    });

    console.log(result);

  } catch (error) {
    console.log("No Value Created💥 "+error);
    process.exit(1);
  }

};

module.exports = createValue;
