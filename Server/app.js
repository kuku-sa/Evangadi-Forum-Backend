const express = require("express");
const cors = require("cors");
const sendEmail = require("./utils/emailSender"); // ← ADD THIS (adjust path if needed)
const app = express();
PORT = 5000;
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Fixed: use array
    credentials: true,
  })
);

// database connection
const dbconnection = require("./Database/databaseconfig");

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

// ⬇️ ADD TEST EMAIL ROUTE HERE ⬇️
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
// ⬆️ ADD TEST EMAIL ROUTE ABOVE ⬆️

async function start() {
  try {
    await dbconnection;
    console.log("✅ Connected to MySQL2 database!");

    app.listen(PORT);
    console.log(`✅ Server is running on port ${PORT}`);
  } catch (error) {
    console.error("❌ DB connection failed:", error.message);
  }
}
start();

