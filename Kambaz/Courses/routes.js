const CoursesDao = require("./dao.js");
const EnrollmentsDao = require("../Enrollments/dao.js");

module.exports = function CourseRoutes(app, db) {
  const dao = CoursesDao(db);
  const enrollmentsDao = EnrollmentsDao(db);

  // 🔐 Faculty middleware
  const requireFaculty = (req, res, next) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "FACULTY") {
      return res.status(403).json({ message: "Only faculty can modify courses" });
    }
    next();
  };

  // 📌 Get all courses (name + description only)
  const findAllCourses = async (req, res) => {
    const courses = await dao.findAllCourses();
    res.json(courses);
  };

  // 📌 Get courses the user is enrolled in (MongoDB Many-to-Many)
  const findCoursesForEnrolledUser = async (req, res) => {
    let { userId } = req.params;

    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) return res.sendStatus(401);
      userId = currentUser._id;
    }

    // NEW: use enrollmentsDao (MongoDB)
    const courses = await enrollmentsDao.findCoursesForUser(userId);
    res.json(courses);
  };

  // 📌 Faculty creates a new course + auto-enroll creator
  const createCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);

    const newCourse = await dao.createCourse(req.body);

    // Auto-enroll creator in their own course
    await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);

    res.json(newCourse);
  };

  // 📌 Update course
  const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const updates = req.body;
    const updated = await dao.updateCourse(courseId, updates);
    res.json(updated);
  };

  // 📌 Delete course + unenroll all users first (required by assignment)
  const deleteCourse = async (req, res) => {
    const { courseId } = req.params;

    // Remove all enrollments for that course
    await enrollmentsDao.unenrollAllUsersFromCourse(courseId);

    // Remove course
    const status = await dao.deleteCourse(courseId);
    res.json(status);
  };

  // ------------------------------------------------------------------------
  // ⭐ REQUIRED BY ASSIGNMENT (ENROLLMENT API)
  // POST /api/users/:uid/courses/:cid
  // DELETE /api/users/:uid/courses/:cid
  // ------------------------------------------------------------------------

  const enrollUserInCourse = async (req, res) => {
    let { uid, cid } = req.params;

    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) return res.sendStatus(401);
      uid = currentUser._id;
    }

    const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
    res.json(status);
  };

  const unenrollUserFromCourse = async (req, res) => {
    let { uid, cid } = req.params;

    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) return res.sendStatus(401);
      uid = currentUser._id;
    }

    const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
    res.json(status);
  };

  // ------------------------------------------------------------------------
  // ⭐⭐⭐ NEW — REQUIRED BY ASSIGNMENT 6.4.3.5
  // GET /api/courses/:cid/users   → returns all users enrolled in this course
  // ------------------------------------------------------------------------

  const findUsersForCourse = async (req, res) => {
    const { cid } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(cid);
    res.json(users);
  };

  app.get("/api/courses/:cid/users", findUsersForCourse);

  // ------------------------------------------------------------------------
  // ROUTES
  // ------------------------------------------------------------------------
  app.get("/api/courses", findAllCourses);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);

  app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
  app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);

  // Faculty-protected routes
  app.post("/api/users/current/courses", requireFaculty, createCourse);
  app.put("/api/courses/:courseId", requireFaculty, updateCourse);
  app.delete("/api/courses/:courseId", requireFaculty, deleteCourse);
};
