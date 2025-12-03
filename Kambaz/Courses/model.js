const mongoose = require("mongoose");
const courseSchema = require("./schema.js");

const CourseModel = mongoose.model("CourseModel", courseSchema);

module.exports = CourseModel;
