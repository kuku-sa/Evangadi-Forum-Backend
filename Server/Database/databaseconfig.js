const { Pool } = require("pg");

// Only load .env in development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};

// const mysql2 = require("mysql2");

// // Only load .env in development (not in production)
// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }

// const dbconnection = mysql2.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT || 3306,
// });

// module.exports = dbconnection.promise();

// const mysql2 = require("mysql2");
// const dotenv = require("dotenv");
// dotenv.config();

// const dbconnection = mysql2.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// module.exports = dbconnection.promise();
// postgresql://evangadi_forum_db_jody_user:fG5C2yQ5I0iTlT1qjc03zROnejcNVhql@dpg-d3u9uguuk2gs73dmud9g-a/evangadi_forum_db_jody