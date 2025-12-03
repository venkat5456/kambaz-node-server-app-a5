const mongoose = require("mongoose");
const schema = require("./schema.js");

const EnrollmentModel = mongoose.model("EnrollmentModel", schema);
module.exports = EnrollmentModel;
