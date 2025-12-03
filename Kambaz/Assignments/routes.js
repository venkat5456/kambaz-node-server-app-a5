const AssignmentsDao = require("./dao.js");

module.exports = (app) => {
  const dao = AssignmentsDao();

  // GET all or by course
  app.get("/api/assignments", async (req, res) => {
    const { course } = req.query;
    const assignments = await dao.findAssignments(course);
    res.json(assignments);
  });

  // GET one by ID
  app.get("/api/assignments/:aid", async (req, res) => {
    const assignment = await dao.findAssignmentById(req.params.aid);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json(assignment);
  });

  // POST create
  app.post("/api/assignments", async (req, res) => {
    const created = await dao.createAssignment(req.body);
    res.json(created);
  });

  // PUT update
  app.put("/api/assignments/:aid", async (req, res) => {
    const updated = await dao.updateAssignment(req.params.aid, req.body);
    res.json(updated);
  });

  // DELETE
  app.delete("/api/assignments/:aid", async (req, res) => {
    await dao.deleteAssignment(req.params.aid);
    res.sendStatus(200);
  });
};
