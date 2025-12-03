// Kambaz/Users/routes.js
const UsersDao = require("./dao.js");

module.exports = function UserRoutes(app) {
  const dao = UsersDao();

  // CREATE USER (admin / API)
  const createUser = async (req, res) => {
    try {
      const user = await dao.createUser(req.body);
      res.json(user);
    } catch (e) {
      console.error("Error creating user:", e);
      res.status(500).json({ message: "Error creating user" });
    }
  };

  // SIGNUP
  const signup = async (req, res) => {
    try {
      const existing = await dao.findUserByUsername(req.body.username);
      if (existing) {
        return res.status(400).json({ message: "Username already taken" });
      }
      const newUser = await dao.createUser(req.body);
      req.session.currentUser = newUser;
      res.json(newUser);
    } catch (e) {
      console.error("Error in signup:", e);
      res.status(500).json({ message: "Error signing up" });
    }
  };

  // SIGNIN
  const signin = async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await dao.findUserByCredentials(username, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      req.session.currentUser = user;
      res.json(user);
    } catch (e) {
      console.error("Error in signin:", e);
      res.status(500).json({ message: "Error signing in" });
    }
  };

  // SIGNOUT
  const signout = async (req, res) => {
    req.session.destroy(() => res.sendStatus(200));
  };

  // PROFILE
  const profile = async (req, res) => {
    const user = req.session.currentUser;
    if (!user) return res.sendStatus(401);
    res.json(user);
  };

  // FIND USER BY ID
  const findUserById = async (req, res) => {
    try {
      const user = await dao.findUserById(req.params.userId);
      res.json(user);
    } catch (e) {
      console.error("Error in findUserById:", e);
      res.status(500).json({ message: "Error fetching user by ID" });
    }
  };

  // FIND ALL USERS
  const findAllUsers = async (req, res) => {
    try {
      const { role, name } = req.query;
      if (role) return res.json(await dao.findUsersByRole(role));
      if (name) return res.json(await dao.findUsersByPartialName(name));
      res.json(await dao.findAllUsers());
    } catch (e) {
      console.error("Error in GET /api/users:", e);
      res.status(500).json({ message: "Error fetching users" });
    }
  };

  // UPDATE USER
  const updateUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const userUpdates = req.body || {};

      await dao.updateUser(userId, userUpdates);

      // keep session currentUser in sync if it's the same user
      const currentUser = req.session.currentUser;
      if (currentUser && currentUser._id === userId) {
        req.session.currentUser = { ...currentUser, ...userUpdates };
      }

      res.json({ status: "ok" });
    } catch (e) {
      console.error("Error updating user:", e);
      res.status(500).json({ message: "Error updating user" });
    }
  };

  // DELETE USER
  const deleteUser = async (req, res) => {
    try {
      const status = await dao.deleteUser(req.params.userId);
      res.json(status);
    } catch (e) {
      console.error("Error deleting user:", e);
      res.status(500).json({ message: "Error deleting user" });
    }
  };

  // ROUTES
  app.post("/api/users", createUser);        // POST /api/users (for + Users button)
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);

  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.get("/api/users/profile", profile);
};
