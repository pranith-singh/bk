require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Connection pool
const pool = mysql.createPool({
  host: process.env.AZURE_MYSQL_HOST,
  user: process.env.AZURE_MYSQL_USER,
  password: process.env.AZURE_MYSQL_PASSWORD,
  database: process.env.AZURE_MYSQL_DATABASE,
  port: process.env.AZURE_MYSQL_PORT || 3306,
  ssl: { rejectUnauthorized: true }
});

// Home route → show tables
app.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SHOW TABLES");
    res.render("index", { tables: rows });
  } catch (err) {
    res.status(500).send("DB Error: " + err.message);
  }
});

// Example route → show records from a table (replace 'users' with your table name)
app.get("/users", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users LIMIT 20");
    res.render("users", { users: rows });
  } catch (err) {
    res.status(500).send("DB Error: " + err.message);
  }
});

app.listen(port, () => {
  console.log(`🚀 Web App running at http://localhost:${port}`);
});
