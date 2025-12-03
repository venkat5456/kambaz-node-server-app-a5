const ModulesDao = require("./dao.js");

module.exports = function ModulesRoutes(app, db) {
  const dao = ModulesDao(db);

  
  // OLD: Get modules from in-memory
  const findModulesForCourseOld = (req, res) => {
    const { courseId } = req.params;
    const modules = dao.findModulesForCourseOld(courseId);
    res.json(modules);
  };

  // OLD: Create module in-memory
  const createModuleOld = (req, res) => {
    const currentUser = req.session.currentUser;
    if (!currentUser) return res.sendStatus(401);
    if (currentUser.role !== "FACULTY") return res.sendStatus(403);

    const module = { ...req.body };
    const newModule = dao.createModuleOld(module);
    res.json(newModule);
  };

  // OLD: Update module in-memory
  const updateModuleOld = (req, res) => {
    const currentUser = req.session.currentUser;
    if (!currentUser) return res.sendStatus(401);
    if (currentUser.role !== "FACULTY") return res.sendStatus(403);

    const { moduleId } = req.params;
    const updates = req.body;
    const updated = dao.updateModuleOld(moduleId, updates);
    res.json(updated);
  };

  // OLD: Delete module in-memory
  const deleteModuleOld = (req, res) => {
    const currentUser = req.session.currentUser;
    if (!currentUser) return res.sendStatus(401);
    if (currentUser.role !== "FACULTY") return res.sendStatus(403);

    const { moduleId } = req.params;
    const status = dao.deleteModuleOld(moduleId);
    res.json(status);
  };

  

  // NEW: Find modules inside a course (MongoDB)
  const findModulesForCourse = async (req, res) => {
    const { courseId } = req.params;
    const modules = await dao.findModulesForCourse(courseId);
    res.json(modules);
  };

  // NEW: Create module inside course (MongoDB)
  const createModuleForCourse = async (req, res) => {
    const currentUser = req.session.currentUser;
    if (!currentUser) return res.sendStatus(401);
    if (currentUser.role !== "FACULTY") return res.sendStatus(403);

    const { courseId } = req.params;
    const newModule = await dao.createModule(courseId, req.body);
    res.json(newModule);
  };

  // NEW: Update module inside course (MongoDB)
  const updateModule = async (req, res) => {
    const currentUser = req.session.currentUser;
    if (!currentUser) return res.sendStatus(401);
    if (currentUser.role !== "FACULTY") return res.sendStatus(403);

    const { courseId, moduleId } = req.params;
    const updates = req.body;
    const updated = await dao.updateModule(courseId, moduleId, updates);
    res.json(updated);
  };

  // NEW: Delete module from course (MongoDB)
  const deleteModule = async (req, res) => {
    const currentUser = req.session.currentUser;
    if (!currentUser) return res.sendStatus(401);
    if (currentUser.role !== "FACULTY") return res.sendStatus(403);

    const { courseId, moduleId } = req.params;
    const status = await dao.deleteModule(courseId, moduleId);
    res.json(status);
  };


  // OLD API (in-memory)
  app.get("/api/courses/:courseId/modules-old", findModulesForCourseOld);
  app.post("/api/courses/:courseId/modules-old", createModuleOld);
  app.put("/api/modules-old/:moduleId", updateModuleOld);
  app.delete("/api/modules-old/:moduleId", deleteModuleOld);

  // NEW API (MongoDB, required by assignment)
  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.post("/api/courses/:courseId/modules", createModuleForCourse);
  app.put("/api/courses/:courseId/modules/:moduleId", updateModule);
  app.delete("/api/courses/:courseId/modules/:moduleId", deleteModule);
};
