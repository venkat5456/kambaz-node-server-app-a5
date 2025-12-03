const EnrollmentsDao = require("./dao.js");

module.exports = (app, db) => {
  const dao = EnrollmentsDao(db);

  // ⭐ GET enrollments (raw list of enrollment documents)
  app.get("/api/enrollments", async (req, res) => {
    const { user, course } = req.query;

    try {
      const results = await dao.findEnrollments(user, course);
      res.json(results);
    } catch (err) {
      console.error("Error in GET /api/enrollments", err);
      res.status(500).json({ message: "Error retrieving enrollments" });
    }
  });

  // ⭐ ENROLL a user into a course
  app.post("/api/enrollments", async (req, res) => {
    const { user, course } = req.body;

    try {
      const enrollment = await dao.enrollUserInCourse(user, course);
      res.json(enrollment);
    } catch (err) {
      res.status(409).json({
        message: "Already enrolled or error creating enrollment",
      });
    }
  });

  // ⭐ UNENROLL using user + course (MongoDB)
  app.delete("/api/enrollments", async (req, res) => {
    const { user, course } = req.body;

    try {
      await dao.unenrollUserFromCourse(user, course);
      res.sendStatus(200);
    } catch (err) {
      console.error("Error in DELETE /api/enrollments", err);
      res.status(500).json({ message: "Error unenrolling user" });
    }
  });
};
