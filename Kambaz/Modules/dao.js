const { v4: uuidv4 } = require("uuid");
const CourseModel = require("../Courses/model.js");

module.exports = function ModulesDao(db) {

  
  function findModulesForCourseOld(courseId) {
    return db.modules.filter((module) => module.course === courseId);
  }

  function createModuleOld(module) {
    const newModule = { ...module, _id: uuidv4() };
    db.modules = [...db.modules, newModule];
    return newModule;
  }

  function deleteModuleOld(moduleId) {
    db.modules = db.modules.filter((m) => m._id !== moduleId);
    return { status: "deleted" };
  }

  function updateModuleOld(moduleId, moduleUpdates) {
    const module = db.modules.find((m) => m._id === moduleId);
    Object.assign(module, moduleUpdates);
    return module;
  }

  // 6.4.2.2 — Retrieve modules for a course (Mongo)
  async function findModulesForCourse(courseId) {
    const course = await CourseModel.findById(courseId);
    return course ? course.modules : [];
  }

  // 6.4.2.3 — Create module inside course document
  async function createModule(courseId, module) {
    const newModule = { ...module, _id: uuidv4() };

    await CourseModel.updateOne(
      { _id: courseId },
      { $push: { modules: newModule } }
    );

    return newModule;
  }

  // 6.4.2.4 — Delete module inside course
  async function deleteModule(courseId, moduleId) {
    return CourseModel.updateOne(
      { _id: courseId },
      { $pull: { modules: { _id: moduleId } } }
    );
  }

  // 6.4.2.5 — Update module inside course
  async function updateModule(courseId, moduleId, updates) {
    const course = await CourseModel.findById(courseId);
    const module = course.modules.id(moduleId);
    Object.assign(module, updates);
    await course.save();
    return module;
  }

  return {
    // OLD
    findModulesForCourseOld,
    createModuleOld,
    deleteModuleOld,
    updateModuleOld,

    // NEW
    findModulesForCourse,
    createModule,
    deleteModule,
    updateModule,
  };
};
