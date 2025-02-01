const { query } = require('./database'); // Assuming you have a database module to handle queries
const { startGameLoop } = require('./game_loop_process'); // Assuming you have a game loop process module

const CHECK_INTERVAL = 30000; // 30 seconds

async function checkForPlayers() {
    try {
        const result = await query('SELECT COUNT(*) as count FROM users WHERE status = "searching"');
        const count = result[0].count;

        if (count >= 2) {
            startGameLoop();
        }
    } catch (error) {
        console.error('Error checking for players:', error);
    }
}

function startChecking() {
    setInterval(checkForPlayers, CHECK_INTERVAL);
}

startChecking();