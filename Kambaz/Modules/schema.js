const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  _id: String,
  name: String,
  description: String,
  lessons: [
    {
      _id: String,
      name: String,
      description: String
    }
  ]
});

module.exports = moduleSchema;
