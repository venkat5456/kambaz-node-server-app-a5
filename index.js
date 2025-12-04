require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const mongoose = require("mongoose");

const Hello = require("./Hello.js");
const Lab5 = require("./Lab5/index.js");

// Load Kambaz Database
const db = require("./Kambaz/Database");

// Routes
const UserRoutes = require("./Kambaz/Users/routes.js");
const CourseRoutes = require("./Kambaz/Courses/routes.js");
const ModulesRoutes = require("./Kambaz/Modules/routes.js");
const AssignmentsRoutes = require("./Kambaz/Assignments/routes.js");
const EnrollmentsRoutes = require("./Kambaz/Enrollments/routes.js");

/* -----------------------------
   MongoDB Connection
 ------------------------------*/

const CONNECTION_STRING = process.env.MONGO_URI;

if (!CONNECTION_STRING) {
  console.error("❌ ERROR: MONGO_URI is not set");
  process.exit(1);
}

mongoose
  .connect(CONNECTION_STRING)
  .then(() => console.log("MongoDB Connected 🚀"))
  .catch((err) => console.log("MongoDB Connection Error ❌", err));

/* -----------------------------
        Express App Setup
 ------------------------------*/

const app = express();

// ⭐ REQUIRED FOR RENDER — enables secure cookies
app.set("trust proxy", 1);

/* -----------------------------
        CORS (FULL FIX)
 ------------------------------*/

const allowedOrigins = [
  "http://localhost:3000",
  "https://kambaz-next-js-a6-sigma.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);




/* -----------------------------
        Sessions 
 ------------------------------*/

app.use(
  session({
    secret: process.env.SESSION_SECRET || "kambaz",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

/* -----------------------------
        JSON Body Parsing
 ------------------------------*/

app.use(express.json());

/* -----------------------------
           API Routes
 ------------------------------*/

Hello(app);
Lab5(app);
UserRoutes(app);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentsRoutes(app, db);
EnrollmentsRoutes(app, db);

/* -----------------------------
           Start Server
 ------------------------------*/

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
