// Kambaz/Users/dao.js
const model = require("./model.js");
const { v4: uuidv4 } = require("uuid");

module.exports = function UsersDao() {
  // CREATE
  const createUser = async (user) => {
    const newUser = { ...user };
    // ⭐ Make sure incoming _id doesn't conflict
    delete newUser._id;
    newUser._id = uuidv4();   // generate new
    return model.create(newUser);
  };

  // READ
  const findAllUsers = async () => model.find();
  const findUserById = async (userId) => model.findById(userId);
  const findUserByUsername = async (username) => model.findOne({ username });
  const findUserByCredentials = async (username, password) =>
    model.findOne({ username, password });

  const findUsersByRole = async (role) => model.find({ role });

  const findUsersByPartialName = async (partialName) => {
    const regex = new RegExp(partialName, "i");
    return model.find({
      $or: [
        { firstName: { $regex: regex } },
        { lastName: { $regex: regex } },
      ],
    });
  };

  // UPDATE (safe: never pass undefined to $set)
  const updateUser = async (userId, user) => {
    const updates =
      user && typeof user === "object"
        ? user
        : {}; // if somehow undefined, make it a no-op instead of crashing
    return model.updateOne({ _id: userId }, { $set: updates });
  };

  // DELETE
  const deleteUser = async (userId) =>
    model.deleteOne({ _id: userId });

  return {
    createUser,
    findAllUsers,
    findUserById,
    findUserByUsername,
    findUserByCredentials,
    findUsersByRole,
    findUsersByPartialName,
    updateUser,
    deleteUser,
  };
};
