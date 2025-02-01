const express = require('express');

const app = express();
const port = 3000;

let gameQueue = [];
let clients = {};

app.use(express.json());

app.post('/connect', (req, res) => {
    const clientId = req.body.clientId;

    if (!clientId) {
        return res.status(400).send('Client ID is required');
    }

    // Add client to the clients list and game queue
    clients[clientId] = { status: 'connected' };
    gameQueue.push(clientId);

    res.status(200).send({ message: 'Connected successfully', clientId: clientId });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});