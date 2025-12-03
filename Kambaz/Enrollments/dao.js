const EnrollmentModel = require("./model.js");
const { v4: uuidv4 } = require("uuid");

module.exports = function EnrollmentsDao(db) {
 
  async function findEnrollments(userId, courseId) {
    try {
      let query = {};

      if (userId) query.user = userId;
      if (courseId) query.course = courseId;

      return await EnrollmentModel.find(query);
    } catch (err) {
      console.error("MongoDB error in findEnrollments → fallback", err);

      let results = db.enrollments;
      if (userId) results = results.filter((e) => e.user === userId);
      if (courseId) results = results.filter((e) => e.course === courseId);
      return results;
    }
  }

  
  async function findCoursesForUser(userId) {
    try {
      const enrollments = await EnrollmentModel
        .find({ user: userId })
        .populate("course");

      return enrollments.map((e) => e.course);
    } catch (err) {
      console.error("MongoDB error in findCoursesForUser → fallback", err);
      return db.enrollments
        .filter((e) => e.user === userId)
        .map((e) => db.courses.find((c) => c._id === e.course));
    }
  }

 
  async function findUsersForCourse(courseId) {
    try {
      const enrollments = await EnrollmentModel
        .find({ course: courseId })
        .populate("user");

      return enrollments.map((e) => e.user);
    } catch (err) {
      console.error("MongoDB error in findUsersForCourse → fallback", err);
      return db.enrollments
        .filter((e) => e.course === courseId)
        .map((e) => db.users.find((u) => u._id === e.user));
    }
  }

  
  async function enrollUserInCourse(userId, courseId) {
    try {
      return await EnrollmentModel.create({
        _id: `${userId}-${courseId}`,
        user: userId,
        course: courseId,
        enrollmentDate: new Date(),
      });
    } catch (err) {
      console.error("MongoDB error in enrollUserInCourse → fallback", err);

      const existing = db.enrollments.find(
        (e) => e.user === userId && e.course === courseId
      );
      if (existing) return null;

      const enrollment = {
        _id: uuidv4(),
        user: userId,
        course: courseId,
      };
      db.enrollments.push(enrollment);
      return enrollment;
    }
  }

  
  async function unenrollUserFromCourse(userId, courseId) {
    try {
      return await EnrollmentModel.deleteOne({ user: userId, course: courseId });
    } catch (err) {
      console.error("MongoDB error in unenrollUserFromCourse → fallback", err);

      const index = db.enrollments.findIndex(
        (e) => e.user === userId && e.course === courseId
      );
      if (index === -1) return null;

      const deleted = db.enrollments[index];
      db.enrollments.splice(index, 1);
      return deleted;
    }
  }

  
  async function unenrollAllUsersFromCourse(courseId) {
    try {
      return await EnrollmentModel.deleteMany({ course: courseId });
    } catch (err) {
      console.error("MongoDB error in unenrollAllUsersFromCourse → fallback", err);
      db.enrollments = db.enrollments.filter((e) => e.course !== courseId);
      return { status: "deleted" };
    }
  }

  
  return {
    findEnrollments, 
    findCoursesForUser,
    findUsersForCourse,
    enrollUserInCourse,
    unenrollUserFromCourse,
    unenrollAllUsersFromCourse,
  };
};
