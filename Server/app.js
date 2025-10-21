const express = require("express");
const cors = require("cors");
const sendEmail = require("./utils/emailSender");
const app = express();
PORT = 5000;
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "https://2025-evangadi-forum-project.netlify.app",
    ],
    credentials: true,
  })
);

// database connection
const dbconnection = require("./Database/databaseconfig");

// Create tables function
async function createTablesIfNotExist() {
  try {
    // Create users table
    await dbconnection.query(`
      CREATE TABLE IF NOT EXISTS users (
        userid SERIAL PRIMARY KEY,
        username VARCHAR(20) NOT NULL UNIQUE,
        firstname VARCHAR(20) NOT NULL,
        lastname VARCHAR(20) NOT NULL,
        email VARCHAR(40) NOT NULL UNIQUE,
        user_password VARCHAR(100) NOT NULL,
        reset_otp VARCHAR(6),
        otp_expiration TIMESTAMP
      )
    `);

    // Create questions table
    await dbconnection.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        questionid VARCHAR(100) NOT NULL UNIQUE,
        userid INT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        title VARCHAR(255) NOT NULL,
        tag VARCHAR(50),
        description TEXT NOT NULL,
        is_deleted SMALLINT DEFAULT 0,
        FOREIGN KEY (userid) REFERENCES users(userid)
      )
    `);

    // Create answers table
    await dbconnection.query(`
      CREATE TABLE IF NOT EXISTS answers (
        answerid SERIAL PRIMARY KEY,
        userid INT NOT NULL,
        questionid VARCHAR(100) NOT NULL,
        answer TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_deleted SMALLINT DEFAULT 0,
        FOREIGN KEY (questionid) REFERENCES questions(questionid),
        FOREIGN KEY (userid) REFERENCES users(userid)
      )
    `);

    console.log("✅ Database tables ready!");
  } catch (error) {
    console.error("❌ Error creating tables:", error);
  }
}

// user routes middleware file
const userRoutes = require("./routes/userroutes");

// user routes middleware
app.use("/api/user", userRoutes);

// Question routes middleware file
const questionRoutes = require("./routes/questionRoute");

// Question routes middleware
app.use("/api/question", questionRoutes);

// answer routes middleware file
const answerRoutes = require("./routes/answerRoute");

// answer routes middleware
app.use("/api/answer", answerRoutes);

// Test email route
app.post("/api/test-email", async (req, res) => {
  try {
    await sendEmail(
      process.env.EMAIL_USER,
      "Test Email",
      "<h1>Email is working!</h1>"
    );
    res.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Test email error:", error);
    res.status(500).json({ error: error.message });
  }
});

async function start() {
  try {
    // Test PostgreSQL connection
    await dbconnection.query("SELECT NOW()");
    console.log("✅ Connected to PostgreSQL database!");

    // Create tables
    await createTablesIfNotExist();

    app.listen(PORT);
    console.log(`✅ Server is running on port ${PORT}`);
  } catch (error) {
    console.error("❌ DB connection failed:", error.message);
  }
}
start();

// const express = require("express");
// const cors = require("cors");
// const sendEmail = require("./utils/emailSender");
// const app = express();
// PORT = 5000;
// app.use(express.json());
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "http://localhost:5174",
//       "http://localhost:5175",
//       "https://2025-evangadi-forum-project.netlify.app",
//     ],
//     credentials: true,
//   })
// );

// // database connection
// const dbconnection = require("./Database/databaseconfig");

// // user routes middleware file
// const userRoutes = require("./routes/userroutes");

// // user routes middleware
// app.use("/api/user", userRoutes);

// // Question routes middleware file
// const questionRoutes = require("./routes/questionRoute");

// // Question routes middleware
// app.use("/api/question", questionRoutes);

// // answer routes middleware file
// const answerRoutes = require("./routes/answerRoute");

// // answer routes middleware
// app.use("/api/answer", answerRoutes);

// // Test email route
// app.post("/api/test-email", async (req, res) => {
//   try {
//     await sendEmail(
//       process.env.EMAIL_USER,
//       "Test Email",
//       "<h1>Email is working!</h1>"
//     );
//     res.json({ message: "Email sent successfully" });
//   } catch (error) {
//     console.error("Test email error:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// async function start() {
//   try {
//     // Test PostgreSQL connection
//     await dbconnection.query("SELECT NOW()");
//     console.log("✅ Connected to PostgreSQL database!");

//     app.listen(PORT);
//     console.log(`✅ Server is running on port ${PORT}`);
//   } catch (error) {
//     console.error("❌ DB connection failed:", error.message);
//   }
// }
// start();

// // const express = require("express");
// // const cors = require("cors");
// // const sendEmail = require("./utils/emailSender");
// // const app = express();
// // PORT = 5000;
// // app.use(express.json());

// // app.use(
// //   cors({
// //     origin: ["http://localhost:5173", "http://localhost:5174"],
// //     credentials: true,
// //   })
// // );

// // // database connection
// // const dbconnection = require("./Database/databaseconfig");

// // // user routes middleware file
// // const userRoutes = require("./routes/userroutes");

// // // user routes middleware
// // app.use("/api/user", userRoutes);

// // // Question routes middleware file
// // const questionRoutes = require("./routes/questionRoute");

// // // Question routes middleware
// // app.use("/api/question", questionRoutes);

// // // answer routes middleware file
// // const answerRoutes = require("./routes/answerRoute");

// // // answer routes middleware
// // app.use("/api/answer", answerRoutes);

// // // Test email route
// // app.post("/api/test-email", async (req, res) => {
// //   try {
// //     await sendEmail(
// //       process.env.EMAIL_USER,
// //       "Test Email",
// //       "<h1>Email is working!</h1>"
// //     );
// //     res.json({ message: "Email sent successfully" });
// //   } catch (error) {
// //     console.error("Test email error:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// // async function start() {
// //   try {
// //     await dbconnection;
// //     console.log("✅ Connected to MySQL2 database!");

// //     app.listen(PORT);
// //     console.log(`✅ Server is running on port ${PORT}`);
// //   } catch (error) {
// //     console.error("❌ DB connection failed:", error.message);
// //   }
// // }
// // start();
