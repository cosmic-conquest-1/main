function startGame() {
    alert("Starting the game...");
    window.location.href = "gameboard.html"; // Redirect to the game page
}

function openLeaderboard() {
    alert("Opening leaderboard...");
    window.location.href = "leaderboardpage.html";
}

function openTutorial() {
    alert("Opening tutorial...");
    window.location.href = "tutorial.html";
}

function openOptions() {
    alert("Opening options...");
    window.location.href = "options.html";
}

function quitGame() {
    alert("Quitting game...");
    window.close(); // Attempts to close the window (may not work in all browsers)
}
