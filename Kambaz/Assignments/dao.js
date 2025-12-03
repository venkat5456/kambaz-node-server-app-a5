const AssignmentModel = require("./model.js");
const { v4: uuidv4 } = require("uuid");

module.exports = function AssignmentsDao() {
  
  // FIND all or by course
  const findAssignments = async (courseId) => {
    if (courseId) {
      return AssignmentModel.find({ course: courseId });
    }
    return AssignmentModel.find();
  };

  // FIND one by ID
  const findAssignmentById = async (aid) => {
    return AssignmentModel.findById(aid);
  };

  // CREATE (attach uuid + course)
  const createAssignment = async (assignment) => {
    const newAssignment = {
      _id: uuidv4(),
      ...assignment,
    };
    return AssignmentModel.create(newAssignment);
  };

  // UPDATE
  const updateAssignment = async (aid, updatedFields) => {
    return AssignmentModel.updateOne(
      { _id: aid },
      { $set: updatedFields }
    );
  };

  // DELETE
  const deleteAssignment = async (aid) => {
    return AssignmentModel.deleteOne({ _id: aid });
  };

  return {
    findAssignments,
    findAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
};
