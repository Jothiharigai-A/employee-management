const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const db = new sqlite3.Database('./employees.db', (err) => {
    if (err) {
        console.error("Error connecting to SQLite database: ", err.message);
    } else {
        console.log('Connected to the SQLite database.');

        // Create the Employee table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS employees (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                department TEXT NOT NULL,
                gender TEXT NOT NULL,
                phone TEXT NOT NULL
            )
        `);
    }
});

// Route to add an employee
app.post('/add-employee', (req, res) => {
    const { name, department, gender, phone } = req.body;
    db.run(`INSERT INTO employees (name, department, gender, phone) VALUES (?, ?, ?, ?)`, [name, department, gender, phone], function(err) {
        if (err) {
            return res.status(500).send("Error adding employee: " + err.message);
        }
        res.redirect('/success.html'); // Redirect to success page
    });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the success page
app.get('/success.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
