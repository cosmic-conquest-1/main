function selectFaction(factionId) {
    // Remove highlight from all factions
    document.querySelectorAll('.faction').forEach(f => f.classList.remove('selected'));
    
    // Highlight selected faction
    document.querySelector(`.faction:nth-child(${factionId})`).classList.add('selected');
    
    console.log(`Faction ${factionId} selected`);
}

function goToMainMenu() {
    alert("Returning to Main Menu");
    window.location.href = '----'; // Redirect to main menu page
}
