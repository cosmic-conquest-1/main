require('dotenv').config(); // Load environment variables from .env

const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const mysql = require('mysql2/promise'); // Use mysql2 for MariaDB

const app = express();
const saltRounds = 10; // Number of rounds for bcrypt hashing

// Create a connection pool to the database
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Asynchronously load SSL/TLS certificates
async function loadCertificates() {
    try {
        const key = await fs.readFile(process.env.SSL_KEY_PATH, 'utf8');
        const cert = await fs.readFile(process.env.SSL_CERT_PATH, 'utf8');
        return { key, cert };
    } catch (err) {
        throw new Error('Error loading SSL/TLS certificates: ' + err.message);
    }
}

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Load users from database
async function loadUsers() {
    try {
        const [rows] = await pool.query('SELECT username, salted_password FROM users');
        return rows;
    } catch (err) {
        throw new Error('Error loading users from database: ' + err.message);
    }
}

// Check if username exists
async function usernameExists(username) {
    try {
        const [rows] = await pool.query('SELECT 1 FROM users WHERE username = ?', [username]);
        return rows.length > 0;
    } catch (err) {
        throw new Error('Error checking username existence: ' + err.message);
    }
}

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT salted_password FROM users WHERE username = ?', [username]);
        const user = rows[0];
        if (user) {
            const match = await bcrypt.compare(password, user.salted_password);
            if (match) return res.json({ success: true });
        }
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Sign-up endpoint
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    try {
        const exists = await usernameExists(username);
        if (exists) return res.status(400).json({ success: false, message: 'Username already taken' });

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await pool.query('INSERT INTO users (username, salted_password) VALUES (?, ?)', [username, hashedPassword]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

(async function startServer() {
    try {
        const server = http.createServer(app); // Use HTTP instead of HTTPS
        const io = new Server(server);

        io.on('connection', (socket) => {
            console.log('A user connected');
            socket.on('message', (msg) => {
                console.log('Message received:', msg);
            });
        });

        server.listen(process.env.PORT, () => {
            console.log(`Server is running on http://localhost:${process.env.PORT}`);
        });
    } catch (err) {
        console.error('Error starting server:', err.message);
    }
})();