const { query } = require("./database");
const { Server } = require("socket.io");

async function startGameLoop(player1, player2) {
    console.log(` Game Started: Player ${player1} vs Player ${player2}`);

    const io = new Server(3001); // WebSocket server

    io.on("connection", (socket) => {
        console.log(` Player connected: ${socket.id}`);

        socket.on("player_move", async (data) => {
            console.log(` Move received: ${data}`);

            // Check if the move is valid
            const isValid = true; // Placeholder logic

            if (isValid) {
                io.emit("update_board", { move: data });

                // Check for game end condition
                const isGameOver = false; // Placeholder logic
                if (isGameOver) {
                    await query("UPDATE users SET status = 'idle' WHERE id IN (?, ?)", [player1, player2]);
                    io.emit("game_over", { winner: player1 });
                    console.log(`🏆 Game Over! Winner: ${player1}`);
                    io.close();
                }
            }
        });

        socket.on("disconnect", async () => {
            console.log("❌ A player disconnected");
            await query("UPDATE users SET status = 'idle' WHERE id IN (?, ?)", [player1, player2]);
            io.close();
        });
    });
}

module.exports = { startGameLoop };
