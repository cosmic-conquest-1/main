const { query } = require("./database");
const { startGameLoop } = require("./game_loop_process");

const CHECK_INTERVAL = 30000; // 30 seconds

async function checkForPlayers() {
    try {
        const result = await query('SELECT id FROM users WHERE status = "searching" LIMIT 2');
        if (result.length >= 2) {
            const player1 = result[0].id;
            const player2 = result[1].id;

            console.log(`Match Found: Player ${player1} vs Player ${player2}`);

            // Update players' status to "in_game"
            await query('UPDATE users SET status = "in_game" WHERE id IN (?, ?)', [player1, player2]);

            // Start game loop with both players
            startGameLoop(player1, player2);
        }
    } catch (error) {
        console.error(" Error checking for players:", error);
    }
}

function startChecking() {
    console.log(" Matchmaking system started...");
    setInterval(checkForPlayers, CHECK_INTERVAL);
}

startChecking();
