const factions = ['Earth','Sun','Moon','Blackhole'];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index between 0 and i
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements at indices i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
}


class Card {
    constructor(type, value) {
        this.type = type; // Type can be 'sun', 'moon', 'earth', 'blackhole', or 'number'
        this.value = value; // Number for number cards, or effect for power cards
    }
}

//Test
class Player {
    constructor(turnOrder, sessionId, faction){
        this.turnOrder = turnOrder;
        this.id=sessionId;
        this.deck = [];
        this.hand = [];
        this.discard = [];
        this.credits = 0;
        this.points = 0;
        if (turnOrder==0){
            this.hand.push(new Card('number',1));
            this.hand.push(new Card('number',2));
            this.hand.push(new Card('number',3));
            this.hand.push(new Card('number',4));
            this.hand.push(new Card('number',5));
            this.deck.push(new Card(factions[faction],10));
        }
        else {
            this.deck.push(new Card('number',1));
            this.hand.push(new Card('number',2));
            this.hand.push(new Card('number',3));
            this.hand.push(new Card('number',4));
            this.hand.push(new Card('number',5));
            this.hand.push(new Card(factions[faction],10));
        }
    }

    draw() {
        this.hand.push(this.deck.pop());
    }

}

class Shop {
    constructor() {
        this.powerCardPile = [];  // Power cards available in the shop
        this.numberCardPile = []; // Number cards available in the shop
        this.powerCardSlot = null;  // A single slot for a power card
        this.numberCardSlots = [null,null,null,null];  // 4 slots for number cards
        for (let value = 6; value < 10; value++){
            this.numberCardPile.push(new Card('number', value));
            this.numberCardPile.push(new Card('number', value));
            this.numberCardPile.push(new Card('number', value));
            this.numberCardPile.push(new Card('number', value));
        }
        shuffle(this.numberCardPile);
        for (let i = 0; i < 4;i++){
            this.addPowerCardToPile(new Card(factions[i],25))
        }
        for (let i = 0; i < 4;i++){
            this.addPowerCardToPile(new Card(factions[i],20))
        }
        this.placePowerCardInSlot(this.powerCardPile.pop());
    }

    addPowerCardToPile(card) {
        this.powerCardPile.push(card);
    }

    addNumberCardToPile(card) {
        this.numberCardPile.push(card);
    }

    placePowerCardInSlot(card) {
        this.powerCardSlot = card;
    }

    placeNumberCardInSlot(card, slotIndex) {
        if (slotIndex >= 0 && slotIndex < 4) {
            this.numberCardSlots[slotIndex] = card;
        } else {
            console.log('Invalid slot index for number card');
        }
    }

    resetShop() {
        if (this.powerCardSlot == null){
            this.placePowerCardInSlot(this.powerCardPile.pop());
        }
        for (let i = 0; i < 4; i++){
            if(this.numberCardSlots[i] == null){
                this.placeNumberCardInSlot(this.numberCardPile.pop(),i);
            }
        }
    }
}

class Game {
    constructor(sessionId1, faction1, sessionId2, faction2) {
        this.players = [new Player(0,sessionId1,faction1), new Player(1,sessionId2,faction2)]
        this.turn = 0;
        this.shop = new Shop;
        this.playedCard = null;
        this.boughtCard = null;
    }

    playMoonCard() {
        this.players[this.turn].discard.push(this.players[this.turn].hand.splice(this.playedCard,1)[0]);
        this.players[this.turn].discard.push(this.players[(this.turn + 1)%2].hand.splice(Math.floor(Math.random() * this.players[(this.turn + 1)%2].hand.length),1)[0]);
    }
    
    playEarthCard() {
        // Remove the card from the player's hand and add it to their discard pile
        this.players[this.turn].discard.push(this.players[this.turn].hand.splice(this.playedCard, 1)[0]);
    
        let lowestCard = null;
    
        // Check the powerCardSlot first (if it exists)
        if (this.shop.powerCardSlot !== null) {
            lowestCard = this.shop.powerCardSlot;
        }
    
        // Loop through the numberCardSlots to find the lowest value card
        for (let i = 0; i < 4; i++) {
            if (this.shop.numberCardSlots[i] !== null) {
                // If no lowestCard has been found yet or the current card is lower than the lowestCard
                if (lowestCard === null || this.shop.numberCardSlots[i].value < lowestCard.value) {
                    lowestCard = this.shop.numberCardSlots[i];
                }
            }
        }
    
        // If a lowestCard is found, add it to the player's hand
        if (lowestCard !== null) {
            this.players[this.turn].hand.push(lowestCard);  // Add to player's hand
    
            // Optional: Remove the card from the shop (if you need to)
            // For example, remove the card from the numberCardSlots or powerCardSlot
            // This can be adjusted based on the rules of your game, but here's how you might do it:
            if (lowestCard === this.shop.powerCardSlot) {
                this.shop.powerCardSlot = null; // Clear the power card slot after it's taken
            } else {
                // Find the index of the lowest card in numberCardSlots and remove it
                const cardIndex = this.shop.numberCardSlots.indexOf(lowestCard);
                if (cardIndex !== -1) {
                    this.shop.numberCardSlots[cardIndex] = null; // Remove the card from the slot
                }
            }
        }
    }
    

    playSunCard() {
        this.players[this.turn].discard.push(this.players[this.turn].hand.splice(this.playedCard,1)[0]);
        this.players[this.turn].credits+=10;
    }

    playBlackholeCard() {
        // Step 1: Discard the Blackhole card itself
        const blackholeCard = this.players[this.turn].hand.splice(this.playedCard, 1)[0];  // Remove the Blackhole card from the player's hand
        this.players[this.turn].discard.push(blackholeCard);  // Add it to the discard pile
    
        // Step 2: Remove a random card from the current player's hand
        if (this.players[this.turn].hand.length > 0) {
            this.players[this.turn].hand.splice(Math.floor(Math.random() * this.players[this.turn].hand.length), 1);
        }
    
        // Step 3: Remove a random card from the opponent's hand
        if (this.players[(this.turn + 1) % 2].hand.length > 0) {
            this.players[(this.turn + 1) % 2].hand.splice(Math.floor(Math.random() * this.players[(this.turn + 1) % 2].hand.length), 1);
        }
    }
    

    playNumberCard() {
        this.players[this.turn].credits += this.players[this.turn].hand[this.playedCard].value;
        this.players[this.turn].discard.push(this.players[this.turn].hand.splice(this.playedCard,1)[0]);
    }

    playCard() {
        let cardToPlay = this.players[this.turn].hand[this.playedCard];
        if (cardToPlay.type == 'number'){
            this.playNumberCard();
        } else if(cardToPlay.type == 'Sun'){
            this.playSunCard();
        }
        else if(cardToPlay.type == 'Earth'){
            this.playEarthCard();
        }
        else if(cardToPlay.type == 'Moon'){
            this.playMoonCard();
        }else if(cardToPlay.type == 'Blackhole'){
            this.playBlackholeCard();
        }
    }

    buyNumberCard() {
        if (this.players[this.turn].credits >= this.shop.numberCardSlots[this.boughtCard].value){
            this.players[this.turn].credits -= this.shop.numberCardSlots[this.boughtCard].value;
            this.players[this.turn].discard.push(this.shop.numberCardSlots[this.boughtCard]);
            this.shop.numberCardSlots[this.boughtCard] = null;
        }
        else {
            console.log("Not enough credits");
        }
    }

    endTurn() {
        this.shop.resetShop();
        this.players[this.turn].credits = 0;
        while (this.players[this.turn].hand.length < 5 ){
            if (this.players[this.turn].deck.length == 0){
                shuffle(this.players[this.turn].discard);
                while (this.players[this.turn].discard > 0){
                    this.players[this.turn].deck.push(this.players[this.turn].discard.pop());
                }
            }
        }
        this.turn += 1;
        this.turn %= 2;
    }
    sanitize(playerId) {
        // Clone the game object
        let sanitizedGame = JSON.parse(JSON.stringify(this));
    
        // Update players
        sanitizedGame.players = sanitizedGame.players.map(player => {
            if (player.id !== playerId) {
                // Clone enemy player
                let enemyPlayer = { ...player };
                
                // Hide the enemy hand (only show length)
                enemyPlayer.hand = player.hand.length; // Only show hand length for enemy
                // Show lengths for the deck and discard piles
                enemyPlayer.deck = player.deck.length;
                enemyPlayer.discard = player.discard.length;
                
                return enemyPlayer;
            } else {
                // Clone the current player
                let currentPlayer = { ...player };
                
                // For current player, show full hand with card details
                // Ensure that each card in hand is represented by its properties (type, value, etc.)
                currentPlayer.hand = player.hand.map(card => {
                    return { type: card.type, value: card.value }; // Adjust based on the actual structure of a card
                });
                
                // Show the length for deck and discard piles
                currentPlayer.deck = player.deck.length;
                currentPlayer.discard = player.discard.length;
    
                return currentPlayer;
            }
        });
    
        return sanitizedGame;
    }
}

module.exports = Game = { Game }

