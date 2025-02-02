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

class Player {
    constructor(turnOrder, sessionId, faction){
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
    }

    playMoonCard() {
        this.players[this.turn].discard.push(this.players[turn].hand.splice(playedCard,1));
        this.players[this.turn].discard.push(this.players[(turn + 1)%2].hand.splice(Math.floor(Math.random() * this.players[(turn + 1)%2].hand.length),1));
    }
    
    playEarthCard() {
        this.players[this.turn].discard.push(this.players[this.turn].hand.splice(playedCard,1));
        let lowestCard = null;
        if (this.shop.powerCardSlot!=null){
            lowestCard = this.shop.powerCardSlot;
        }
        let counter = 0;
        while (counter < 4 && lowestCard == null){
            if (this.shop.numberCardSlots[counter]!=null){
                lowestCard = this.shop.numberCardSlots[counter];
            }
        }
        if (lowestCard == null){
            return;
        }
        else {
            for (let i = 0; i < 4; i++){
                if (this.shop.numberCardSlots[i]!=null && this.shop.numberCardSlots[i].value<lowestCard.value){
                    lowestCard = this.shop.numberCardSlots[i];
                }
            }
        }
        
    }

    playSunCard() {
        this.players[this.turn].discard.push(this.players[this.turn].hand.splice(playedCard,1));
        this.players[this.turn].credits+=10;
    }

    playBlackholeCard() {
        this.players[this.turn].discard.push(this.players[this.turn].hand.splice(playedCard,1));
    }

    playNumberCard() {
        this.players[this.turn].credits += this.players[this.turn].hand.playedCard.value;
        this.players[this.turn].discard.push(this.players[this.turn].hand.splice(playedCard,1));
    }

    endTurn() {
        shop.resetShop();
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
}

let test = new Game('1',1,'2',0);
test.shop.resetShop()

console.log(test);
