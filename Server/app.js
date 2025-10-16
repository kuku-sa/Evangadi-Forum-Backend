const express = require("express");
const cors = require("cors");
const app = express();
PORT = 5000;
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", 
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

async function start() {
  try {
    await dbconnection; 
    console.log(" Connected to MySQL2 database!");

    app.listen(PORT);
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error(" DB connection failed:", error.message);
  }
}
start();
