require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const mongoose = require("mongoose");

const Hello = require("./Hello.js");
const Lab5 = require("./Lab5/index.js");

// Load Kambaz Database (index.ts / index.js)
const db = require("./Kambaz/Database");

// Kambaz feature routes
const UserRoutes = require("./Kambaz/Users/routes.js");
const CourseRoutes = require("./Kambaz/Courses/routes.js");
const ModulesRoutes = require("./Kambaz/Modules/routes.js");
const AssignmentsRoutes = require("./Kambaz/Assignments/routes.js");
const EnrollmentsRoutes = require("./Kambaz/Enrollments/routes.js");

const CONNECTION_STRING = process.env.MONGO_URI;

if (!CONNECTION_STRING) {
  console.error("❌ ERROR: MONGO_URI is not set in Render environment variables");
  process.exit(1);
}

mongoose
  .connect(CONNECTION_STRING)
  .then(() => console.log("MongoDB Connected 🚀"))
  .catch((err) => console.log("MongoDB Connection Error ❌", err));


const app = express();

// CORS configuration (Frontend: Vercel + Localhost)
const allowedOrigins = [
  "http://localhost:3000",
  "https://kambaz-next-js-a6-sigma.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "kambaz",
    resave: false,
    saveUninitialized: false,
  })
);

// JSON body parsing
app.use(express.json());

// General API
Hello(app);
Lab5(app);

// Register all Kambaz Routes
UserRoutes(app);         // Users routes don't use `db`
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentsRoutes(app, db);
EnrollmentsRoutes(app, db);

// Server Start
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
