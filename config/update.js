const mongoose = require("mongoose");
const Value = require("../models/Value.js")

const updateValue = async () => {
    try {
        const result = await Value.updateOne(
            { name: "Incrementor" },
            { $inc: { value_index: 1 } }
        );
        // console.log(result);
        const position = await Value.findOne({ name: "Incrementor" });
        // console.log(position.value_index);
        return position.value_index;
        
    } catch (error) {
        console.log("No Value Updated 💥 "+error);
        process.exit(1);
    }
};

module.exports = updateValue;
