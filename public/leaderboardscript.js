// Sample player data
/*let players = [
    { name : "Alice", score: 1500 },
    { name: "Bob", score: 1350 },
    { name: "Charlie", score: 1200 }
];
*/
// Function to update the leaderboard dynamically
function updateLeaderboard() {
    let tbody = document.getElementById("leaderboard-body");
    tbody.innerHTML = ""; // Clear existing rows

    // Sort players by score (highest first)
    players.sort((a, b) => b.score - a.score);

    // Populate the table
    players.forEach((player, index) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.name}</td>
            <td>${player.score}</td>
        `;
        tbody.appendChild(row);
    });
}

// Function to add a random player score (for testing)
/*function addRandomPlayer() {
    let randomNames = ["David", "Eve", "Frank", "Grace", "Hank"];
    let randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    let randomScore = Math.floor(Math.random() * 2000) + 500; // Random score between 500-2500

    players.push({ name: randomName, score: randomScore });
    updateLeaderboard();
}
*/
// Initialize leaderboard on page load
document.addEventListener("DOMContentLoaded", updateLeaderboard);

function goHome() {
    window.location.href = "----"; // Change this to your home page URL
}

async function loadLeaderboard() {
    try {
        const response = await fetch('/leaderboard');
        const data = await response.json();

        if (data.success) {
            const leaderboard = document.getElementById('leaderboard');
            leaderboard.innerHTML = ''; // Clear existing list

            data.leaderboard.forEach((player, index) => {
                const entry = document.createElement('li');
                entry.textContent = `#${index + 1} ${player.Username} - ${player.Rating} points`;
                leaderboard.appendChild(entry);
            });
        }
    } catch (error) {
        console.error('Error loading leaderboard:', error);
    }
}

