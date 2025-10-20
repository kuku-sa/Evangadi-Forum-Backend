const dbconnection = require("./Database/databaseconfig");

async function setupDatabase() {
  try {
    // Create users table
    await dbconnection.query(`
      CREATE TABLE IF NOT EXISTS users (
        userid SERIAL PRIMARY KEY,
        username VARCHAR(20) NOT NULL,
        firstname VARCHAR(20) NOT NULL,
        lastname VARCHAR(20) NOT NULL,
        email VARCHAR(40) NOT NULL,
        user_password VARCHAR(100) NOT NULL,
        reset_otp VARCHAR(6),
        otp_expiration TIMESTAMP
      )
    `);
    console.log("✅ Users table created");

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
    console.log("✅ Questions table created");

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
    console.log("✅ Answers table created");

    console.log("🎉 All tables created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating tables:", error);
    process.exit(1);
  }
}

setupDatabase();
