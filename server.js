/* =========================
   IMPORTS
========================= */
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const path = require("path");

/* =========================
   APP SETUP
========================= */
const app = express();
app.use(express.json());

// Serve all frontend files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

/* =========================
   DATABASE CONNECTION
========================= */
const db = new sqlite3.Database(path.join(__dirname, "database.db"), (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

/* =========================
   CREATE USERS TABLE IF NOT EXISTS
========================= */
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    location TEXT NOT NULL,
    password TEXT NOT NULL
  )
`, (err) => {
  if (err) console.error("Error creating users table:", err.message);
});

/* =========================
   ROUTES
========================= */

// Serve homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Homepage.html"));
});

// REGISTER ROUTE
app.post("/register", async (req, res) => {
  try {
    const { name, surname, email, location, password } = req.body;

    if (!name || !surname || !email || !location || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      "INSERT INTO users (name, surname, email, location, password) VALUES (?, ?, ?, ?, ?)",
      [name, surname, email, location, hashedPassword],
      function (err) {
        if (err) {
          return res.status(400).json({ message: "Email already exists" });
        }
        res.json({ message: "Registered successfully" });
      }
    );
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN ROUTE
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (!user) return res.status(401).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Wrong password" });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        location: user.location
      }
    });
  });
});

// TEST DATABASE ROUTE
app.get("/test-db", (req, res) => {
  db.all("SELECT id, name, surname, email, location FROM users", (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(rows);
  });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
