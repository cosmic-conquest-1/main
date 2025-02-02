// Oyun durumunu yükle
async function loadGameState() {
    try {
        const response = await fetch('../values.json');
        const gameState = await response.json();
        updateRound(gameState);
        updateCardVisibility(gameState);
        updateTotalValue(gameState);
        setupDraggableCards();
    } catch (error) {
        console.error('Error loading game state:', error);
    }
}

// Global değişkenler
let selectedCards = new Set();
let availableCredits = 0;
let playedValue = 0;

// Sürüklenebilir kartları ayarla
function setupDraggableCards() {
    const playerCards = document.querySelectorAll('.playerCards');
    playerCards.forEach(card => {
        card.addEventListener('mousedown', startDragging);
    });

    // Shop kartlarına tıklama olayı ekle
    const shopCards = document.querySelectorAll('.availableCards');
    shopCards.forEach(card => {
        card.addEventListener('click', tryToBuyCard);
    });
}

// Kart sürükleme başlangıcı
function startDragging(e) {
    const card = e.currentTarget;
    const startY = e.clientY;
    const cardRect = card.getBoundingClientRect();
    const cardValue = parseInt(card.getAttribute('data-value')) || 0;
    let isPlayed = false;

    function onMouseMove(e) {
        const currentY = e.clientY;
        const dragDistance = startY - currentY;
        const cardHeight = cardRect.height;
        const dragPercentage = (dragDistance / cardHeight) * 100;

        // Kartı yukarı sürükle
        if (!isPlayed) {
            card.style.transform = `translateY(${-dragDistance}px)`;
        }

        // Eğer %33 yukarı sürüklendiyse
        if (dragPercentage >= 33 && !isPlayed) {
            isPlayed = true;
            if (!selectedCards.has(card)) {
                selectedCards.add(card);
                playedValue += cardValue;
                updatePlayedValue();
                // Kartı ortaya sabitle
                card.classList.add('played-card');
                card.style.opacity = '0.6';
            }
        }
    }

    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        
        // Eğer kart oynanmadıysa orijinal konumuna geri dön
        if (!isPlayed) {
            card.style.transform = '';
        }
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

// Oynanan kartların değerini güncelle
function updatePlayedValue() {
    const playedValueElement = document.getElementById('playedValue');
    if (playedValueElement) {
        playedValueElement.textContent = playedValue;
    }
}

// Kart satın alma denemesi
function tryToBuyCard(e) {
    const shopCard = e.currentTarget;
    const cardCost = parseInt(shopCard.getAttribute('data-value')) || 0;

    if (playedValue >= cardCost) {
        // Seçili kartları oynat ve shop kartını satın al
        selectedCards.forEach(card => {
            card.style.display = 'none';
            card.classList.remove('played-card');
        });
        
        // Değişkenleri sıfırla
        selectedCards.clear();
        playedValue = 0;
        updatePlayedValue();
        
        // Shop kartını kaldır
        shopCard.style.display = 'none';
    } else {
        alert('Yetersiz kredi!');
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
                
                // Kart değerini data-value olarak ekle
                cardElement.setAttribute('data-value', card.value);
                
                let cardSvgPath;
                if (card.type === 'number') {
                    cardSvgPath = `../public/images/cards/number${card.value}card.svg`;
                } else if (card.type === 'sun') {
                    cardSvgPath = '../public/images/cards/SunCard.svg';
                } else if (card.type === 'blackhole') {
                    cardSvgPath = '../public/images/cards/BlackHoleCard.svg';
                }

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