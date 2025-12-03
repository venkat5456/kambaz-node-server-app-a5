// Kambaz/Users/model.js
const mongoose = require("mongoose");
const schema = require("./schema.js");

const UserModel = mongoose.model("UserModel", schema);
module.exports = UserModel;
