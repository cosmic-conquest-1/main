require('dotenv').config(); // Load environment variables from .env

const https = require('https');
const express = require('express');
const { Server } = require('socket.io');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const mysql = require('mysql2/promise'); // Use mysql2 for MariaDB
const GameModule = require('./game');

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
        const [rows] = await pool.query('SELECT Username, Password FROM client');
        return rows;
    } catch (err) {
        throw new Error('Error loading users from database: ' + err.message);
    }
}

// Check if username exists
async function usernameExists(username) {
    try {
        const [rows] = await pool.query('SELECT 1 FROM client WHERE Username = ?', [username]);
        return rows.length > 0;
    } catch (err) {
        throw new Error('Error checking username existence: ' + err.message);
    }
}

/*// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT Password FROM client WHERE Username = ?', [username]);
        const user = rows[0];
        if (user) {
            const match = await bcrypt.compare(password, user.Password);
            if (match) return res.json({ success: true });
        }
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});*/

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
        await pool.query('INSERT INTO client (Username, Password) VALUES (?, ?)', [username, hashedPassword]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

//Queue to manage session IDs

let sessionQueue = [];
let games = [];

(async function startServer() {
    try {
        const { key, cert } = await loadCertificates();
        const server = https.createServer({ key, cert }, app);
        const io = new Server(server);

        /*io.on('connection', (socket) => {
            console.log('A user connected');
            socket.on('message', (msg) => {
                console.log('Message received:', msg);
            });
        });*/

        io.on('connection', (socket) => {
            console.log('A user connected, socket ID:', socket.id);

            // Listen for 'joinQueue' event when user clicks "Play"
            socket.on('joinQueue', (data) => {
                //const { socketId, faction } = data; // Extract socket ID and faction
                // Add the user's session ID to the queue
                sessionQueue.push(data);
                console.log(`User with socket ID ${data[0]} and ${data[1]} joined the queue.`);

                //Printing out queue
                console.log(sessionQueue);


                //If session queue has exactly 2 players waiting

                if(sessionQueue.length == 2){
                    //Temp variables to store sock_id and faction
                    tempSock1 = sessionQueue[0][0];
                    tempFaction1 = sessionQueue[0][1];
                    tempSock2 = sessionQueue[1][0];
                    tempFaction2 = sessionQueue[1][1];

                    //console.log(tempSock1,tempFaction1,tempSock2,tempFaction2);
                   
                    //games.push(new gameState.Game(p1[0],p1[1],p2[0],p2[1]))
                    games.push(new GameModule.Game(tempSock1,tempFaction1,tempSock2,tempFaction2));

                    const game = games[0]; 
                    const sanitizedGameData = game.sanitize(game.players[0]);

                    // Emit game data to both players
                    io.to(game.players[0].id).emit('gameState', sanitizedGameData);
                    io.to(game.players[1].id).emit('gameState', sanitizedGameData);

                    
                }
                });


            // When the user disconnects, remove the session ID from the queue
            socket.on('disconnect', () => {
                const index = sessionQueue.indexOf(socket.id);
                if (index !== -1) {
                    sessionQueue.splice(index, 1);
                    console.log('User disconnected, socket ID removed from queue:', socket.id);
                }
            });
        });

        // Start the HTTPS server on the port specified in the .env file
        server.listen(process.env.PORT, () => {
            console.log(`Server is running on https://localhost:${process.env.PORT}`);
        });
    } catch (err) {
        console.error('Error starting server:', err.message);
    }
})();


// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT Password FROM client WHERE Username = ?', [username]);
        const user = rows[0];
        if (user) {
            const match = await bcrypt.compare(password, user.Password);
            if (match) {
                // Get the socket ID from the client-side (which we'll send after login)
                const socketId = req.body.socketId;

                // Save the socket ID for this user in the database
                await pool.query('UPDATE client SET Session_Id = ? WHERE Username = ?', [socketId, username]);
                
                 // Log the authenticated user to the terminal
                 console.log(`${username} authenticated`);

                return res.json({ success: true, socketId: socketId }); // Send the socketId to the client
            }
        }
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

//12312