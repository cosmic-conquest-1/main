const { query } = require("./database");

async function updateElo(winner, loser) {
    console.log(` Updating ELO: Winner ${winner} vs Loser ${loser}`);

    const K = 32; // K-factor (adjusts rating change)
    
    // Get current ratings
    const [winnerData] = await query("SELECT rating FROM users WHERE id = ?", [winner]);
    const [loserData] = await query("SELECT rating FROM users WHERE id = ?", [loser]);

    let winnerRating = winnerData[0].rating;
    let loserRating = loserData[0].rating;

    // Calculate expected scores
    const expectedWinner = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
    const expectedLoser = 1 / (1 + Math.pow(10, (winnerRating - loserRating) / 400));

    // Update ratings
    winnerRating += K * (1 - expectedWinner);
    loserRating += K * (0 - expectedLoser);

    // Update database
    await query("UPDATE users SET rating = ? WHERE id = ?", [Math.round(winnerRating), winner]);
    await query("UPDATE users SET rating = ? WHERE id = ?", [Math.round(loserRating), loser]);

    console.log(` New Ratings: Winner ${winner} -> ${Math.round(winnerRating)}, Loser ${loser} -> ${Math.round(loserRating)}`);
}

module.exports = { updateElo };