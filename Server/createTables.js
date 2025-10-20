const dbconnection = require("./Database/databaseconfig");

async function createTables() {
  try {
    const connection = await dbconnection;

    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        userid INT NOT NULL AUTO_INCREMENT,
        username VARCHAR(20) NOT NULL,
        firstname VARCHAR(20) NOT NULL,
        lastname VARCHAR(20) NOT NULL,
        email VARCHAR(40) NOT NULL,
        user_password VARCHAR(100) NOT NULL,
        reset_otp VARCHAR(6),
        otp_expiration DATETIME,
        PRIMARY KEY (userid)
      )
    `);
    console.log("✅ Users table created");

    // Create questions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id INT NOT NULL AUTO_INCREMENT,
        questionid VARCHAR(100) NOT NULL UNIQUE,
        userid INT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        title VARCHAR(255) NOT NULL,
        tag VARCHAR(50),
        description TEXT NOT NULL,
        is_deleted TINYINT(1) DEFAULT 0,
        PRIMARY KEY (id),
        FOREIGN KEY (userid) REFERENCES users(userid)
      )
    `);
    console.log("✅ Questions table created");

    // Create answers table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS answers (
        answerid INT NOT NULL AUTO_INCREMENT,
        userid INT NOT NULL,
        questionid VARCHAR(100) NOT NULL,
        answer TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_deleted TINYINT(1) DEFAULT 0,
        PRIMARY KEY (answerid),
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

createTables();
