const express = require("express");
const cors = require("cors");
const sendEmail = require("./utils/emailSender");
const dbconnection = require("./Database/databaseconfig");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "https://2025-evangadi-forum-project.netlify.app",
      "https://evangadi-forum-new.netlify.app",
    ],
    credentials: true,
  })
);

// Test route for Railway
app.get("/", (req, res) => {
  res.send("🚀 Evangadi Forum Backend is running successfully on Railway!");
});

// Routes
const userRoutes = require("./routes/userroutes");
const questionRoutes = require("./routes/questionRoute");
const answerRoutes = require("./routes/answerRoute");

app.use("/api/user", userRoutes);
app.use("/api/question", questionRoutes);
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

// Create tables if not exist
async function createTablesIfNotExist() {
  try {
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

// Start server and DB connection
async function start() {
  try {
    await dbconnection.query("SELECT NOW()");
    console.log("✅ Connected to PostgreSQL database!");

    await createTablesIfNotExist();

    // ✅ Only ONE app.listen()
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ DB connection failed:", error.message);
  }
}

start();
