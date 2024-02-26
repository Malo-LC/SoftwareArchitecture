const users = [
  {
    id: 1,
    username: "admin",
    email: "admin@localhost.com",
    password: "$2a$10$aPu2KaK2yHo5Gne/VVnbxuDONDsmrkqC4fmHbNGn1/al0LTnSx61O", // Hashed password for "admin"
    role: "admin",
  },
  {
    id: 2,
    username: "user",
    email: "user@localhost.com",
    password: "$2a$10$aPu2KaK2yHo5Gne/VVnbxuDONDsmrkqC4fmHbNGn1/al0LTnSx61O", // Hashed password for "admin"
    role: "user",
  },
];

module.exports = users;
