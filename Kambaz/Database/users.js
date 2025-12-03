module.exports = [
  {
    _id: "1",
    username: "venkat",
    password: "123",
    firstName: "Venkat",
    lastName: "Sai",
    email: "venkat@neu.edu",
    dob: "2000-01-01",
    role: "STUDENT",  // 🔒 Cannot modify courses/modules
  },
  {
    _id: "2",
    username: "alice",
    password: "123",
    firstName: "Alice",
    lastName: "Wonderland",
    email: "alice@wonderland.com",
    dob: "2000-02-02",
    role: "FACULTY",  // ⭐ Can add/edit/delete courses/modules
  },

  {
    _id: "3",
    username: "Jame",
    password: "hudson",
    firstname: "huds",
    lastName: "CS1234.03",
    email: "Admin",
    dob: "2003-02-02",
    role: "ADMIN",
  },
];
