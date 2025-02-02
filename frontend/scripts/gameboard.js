// Oyun durumunu yükle
async function loadGameState() {
    try {
        const response = await fetch('../values.json');
        const gameState = await response.json();
        updateRound(gameState);
        updateCardVisibility(gameState);
        updateTotalValue(gameState);
    } catch (error) {
        console.error('Error loading game state:', error);
    }
}

// Round'u güncelle
function updateRound(gameState) {
    const roundElement = document.getElementById('currentRound');
    if (roundElement) {
        roundElement.textContent = gameState.turn;
    }
}

// Toplam değeri güncelle
function updateTotalValue(gameState) {
    const totalValueElement = document.getElementById('totalValue');
    if (totalValueElement) {
        const playerHand = gameState.players[1]?.hand || [];
        const totalValue = playerHand.reduce((sum, card) => sum + card.value, 0);
        totalValueElement.textContent = totalValue;
    }
}

// Kart görünürlüğünü güncelle
function updateCardVisibility(gameState) {
    // Rakip kartlarını güncelle - decklength'e göre
    const enemyDeckLength = gameState.players[0]?.decklength || 5;
    for (let i = 1; i <= 5; i++) {
        const cardElement = document.getElementById(`enemyCard${i}`);
        if (cardElement) {
            cardElement.style.display = i <= enemyDeckLength ? 'block' : 'none';
        }
    }

    // Oyuncu kartlarını güncelle ve değerlerini göster
    const playerHand = gameState.players[1]?.hand || [];
    for (let i = 1; i <= 5; i++) {
        const cardElement = document.getElementById(`playerCard${i}`);
        if (cardElement) {
            if (i <= playerHand.length) {
                cardElement.style.display = 'block';
                const card = playerHand[i-1];
                
                // Kart tipine göre SVG dosyasını belirle
                let cardSvgPath;
                if (card.type === 'number') {
                    cardSvgPath = `../public/images/cards/number${card.value}card.svg`;
                } else if (card.type === 'sun') {
                    cardSvgPath = '../public/images/cards/SunCard.svg';
                } else if (card.type === 'blackhole') {
                    cardSvgPath = '../public/images/cards/BlackHoleCard.svg';
                }

                // SVG'yi yükle ve göster
                cardElement.innerHTML = `<img src="${cardSvgPath}" width="170" height="255" style="border-radius: 10px;">`;
            } else {
                cardElement.style.display = 'none';
            }
        }
    }
}

// Sayfa yüklendiğinde oyun durumunu yükle
document.addEventListener('DOMContentLoaded', loadGameState);

// Her 5 saniyede bir oyun durumunu güncelle
setInterval(loadGameState, 5000); 