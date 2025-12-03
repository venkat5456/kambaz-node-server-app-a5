const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    description: String,
    dueDate: Date,
    points: Number,
    course: { type: String, ref: "CourseModel" }  // relation
  },
  { collection: "assignments" }
);

module.exports = assignmentSchema;
