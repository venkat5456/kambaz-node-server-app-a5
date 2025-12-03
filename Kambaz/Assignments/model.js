const mongoose = require("mongoose");
const schema = require("./schema.js");

const AssignmentModel = mongoose.model("AssignmentModel", schema);
module.exports = AssignmentModel;
