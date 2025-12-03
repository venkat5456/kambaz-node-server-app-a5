const mongoose = require("mongoose");
const moduleSchema = require("../Modules/schema.js");

const courseSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    number: String,
    credits: Number,
    description: String,
    modules: [moduleSchema]   // embedded modules
  },
  { collection: "courses" }
);

module.exports = courseSchema;
