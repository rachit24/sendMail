const mongoose = require("mongoose");
const Value = require("../models/Value.js")

const findValue = async () => {
  try {
    const position = await Value.findOne({ value_index: "2" });
    console.log("I is at position: ", position.value_index);

  } catch (error) {
    console.log("No Value Found 💥"+error);
    process.exit(1);
  }

};

module.exports = findValue;
