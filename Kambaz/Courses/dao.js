const CourseModel = require("./model.js");
const { v4: uuidv4 } = require("uuid");

module.exports = function CoursesDao(db) {

  // GET ALL COURSES (ONLY name + description per assignment)
  const findAllCourses = async () => {
    return CourseModel.find({}, { name: 1, description: 1 });
  };

  // GET COURSES FOR USER (using IN-MEMORY enrollments)
  const findCoursesForEnrolledUser = async (userId) => {
    const enrollments = db.enrollments; // using in-memory per assignment

    const courseIds = enrollments
      .filter((e) => e.user === userId)
      .map((e) => e.course);

    return CourseModel.find(
      { _id: { $in: courseIds } },
      { name: 1, description: 1 }
    );
  };

  // CREATE COURSE  ⭐ REQUIRED FIX: include modules: []
  const createCourse = async (course) => {
    const newCourse = {
      ...course,
      _id: uuidv4(),
      modules: [],   // <-- REQUIRED BECAUSE MODULES ARE EMBEDDED
    };
    return CourseModel.create(newCourse);
  };

  // DELETE COURSE
  const deleteCourse = async (courseId) => {
    await CourseModel.deleteOne({ _id: courseId });

    // remove enrollments from MEMORY (assignment requirement)
    db.enrollments = db.enrollments.filter(
      (e) => e.course !== courseId
    );

    return { status: "deleted" };
  };

  // UPDATE COURSE
  const updateCourse = async (courseId, updates) => {
    return CourseModel.updateOne(
      { _id: courseId },
      { $set: updates }
    );
  };

  return {
    findAllCourses,
    findCoursesForEnrolledUser,
    createCourse,
    deleteCourse,
    updateCourse,
  };
};
