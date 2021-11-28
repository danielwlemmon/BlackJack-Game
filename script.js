const SUITS = ["♠", "♣", "♥", "♦"]
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

let gameDeck = [];


var btnNew = document.getElementById("beginGame");
btnNew.addEventListener("click", beginGame);

class Player {
  constructor(name, hand, cardTotal, currentBet, balance) {
    this.name = name;
    this.hand = hand;
    this.cardTotal = cardTotal;
    this.currentBet = currentBet;
    this.money = balance;
  }
}

let player = new Player("player", [], 0, 0, 100);
let dealer = new Player("dealer", [], 0, 0, 1000);

function buildDeck() {
  let deck = []; //use different method rather than two for loops
  for (let s = 0; s < SUITS.length; s++) {
    for (let v = 0; v < VALUES.length; v++) {
      deck.push([VALUES[v], SUITS[s]]);
    }
  }
  return deck;
}

function shuffleDeck(deck) {

  for (let i = 0; i < deck.length; i++) {
    const newIndex = Math.floor(Math.random() * (i + 1));
    const oldValue = deck[newIndex];
    deck[newIndex] = deck[i];
    deck[i] = oldValue;
  }

  return deck;
}

function resetGame() {
  document.getElementById("beginGame").innerHTML = "Play again?";
  document.getElementById("dealerTotal").innerHTML = "";
  player.hand = [];
  player.cardTotal = 0;
  dealer.hand = [];
  dealer.cartTotal = 0;
  player.currentBet = 10;
  player.money -= player.currentBet;
  gameDeck = shuffleDeck(buildDeck());
  //deal initial cards alternating player/dealer.  Make this a function when adding more players.
  oneToPlayer();
  oneToDealer();
  oneToPlayer();
  oneToDealer();
  document.getElementById("playerBet").innerHTML = "Your Current Bet: $" + player.currentBet;
  document.getElementById("playerMoney").innerHTML = "Player balance $" + player.money;
}

function calcHand(hand) {
  let aceCount = 0;
  let total = 0;
  for (let i = 0; i < hand.length; i++) {
    const currentCard = hand[i];

    if (currentCard[0] == "A") {
      aceCount += 1;
      total += 11;

    } else if (currentCard[0] == "K" || currentCard[0] == "Q" || currentCard[0] == "J" || currentCard[0] == "10") {
      total += 10;

    } else {
      total += parseInt(currentCard[0]);
    }
  }
  if (aceCount > 0 && total > 21) {
    total = total - 10;
    if (total > 21 && aceCount > 1) {
      total = total - 10;
    }
  }
  return total;
}

function oneToPlayer() {
  player.hand.push(gameDeck.shift());
  updatePlayerHand();
  if (player.cardTotal >= 21) { document.getElementById("hit").disabled = true };
  if (player.hand.length > 2) { document.getElementById("doubleBet").disabled = true };
}

function oneToDealer() {
  dealer.hand.push(gameDeck.shift());
}

function doubleBet() {
  player.money -= player.currentBet;
  player.currentBet *= 2;
  document.getElementById("playerBet").innerHTML = "Your Current Bet: $" + player.currentBet;
  document.getElementById("playerMoney").innerHTML = "Player balance $" + player.money;
  document.getElementById("doubleBet").disabled = true;
}

function updatePlayerHand() {
  player.cardTotal = calcHand(player.hand);
  document.getElementById("playerHand").innerHTML = "Player's Hand: " + (player.hand);
  document.getElementById("playerTotal").innerHTML = "Player total: " + (player.cardTotal);
  if (player.total >= 21) {
    finishGame();
  } else {
    document.getElementById("hit").disabled = false;
    document.getElementById("stay").disabled = false;
  }
}

function updateDealerHand() {
  dealer.cardTotal = calcHand(dealer.hand);
  document.getElementById("dealerHand").innerHTML = "Dealer's Hand: " + dealer.hand;
  document.getElementById("dealerTotal").innerHTML = "Dealer total: " + dealer.cardTotal;
}

function beginGame() {
  if (player.money >= 20) {
    document.getElementById("doubleBet").disabled = false;
  }

  document.getElementById("beginGame").disabled = true;
  resetGame();
  document.getElementById("hit").disabled = false;
  document.getElementById("stay").disabled = false;
  updatePlayerHand();
  document.getElementById("dealerHand").innerHTML = "Dealer's Hand: " + dealer.hand[0] + " ??";

  document.getElementById("status").innerHTML = "Decisions Decisions..."
  var hit = document.getElementById("hit");
  hit.addEventListener("click", oneToPlayer);

  var stay = document.getElementById("stay");
  stay.addEventListener("click", finishGame);

  var doubleBetQuestion = document.getElementById("doubleBet");
  doubleBetQuestion.addEventListener("click", doubleBet);
}

function finishGame() {
  document.getElementById("doubleBet").disabled = true;
  document.getElementById("hit").disabled = true;
  document.getElementById("stay").disabled = true;
  updateDealerHand();

  dealerTurn();
  gameResult();

  if (player.money >= 10) {
    document.getElementById("beginGame").disabled = false;
  } else {
    document.getElementById("status").innerHTML = "You have run out of Money.  GAME OVER!!!";
  }
}

function dealerTurn() {
  while ((dealer.cardTotal < 17 && player.cardTotal <= 21) && (dealer.cardTotal <= player.cardTotal)) {
    dealer.hand.push(gameDeck.shift());
    updateDealerHand();
  }

}

function gameResult() {
  if (player.cardTotal > 21 || (dealer.cardTotal > player.cardTotal && dealer.cardTotal <= 21)) {
    document.getElementById("status").innerHTML = ("Dealer wins." + " You Lost $" + player.currentBet);
    dealer.money += player.currentBet;
    document.getElementById("playerMoney").innerHTML = "Player balance $" + player.money;
    document.getElementById("playerBet").innerHTML = "";

  } else if (player.cardTotal <= 21 && dealer.cardTotal > 21 || (dealer.cardTotal < player.cardTotal && player.cardTotal <= 21)) {
    document.getElementById("status").innerHTML = ("You win" + " $" + player.currentBet);
    player.money += (player.currentBet * 2);
    dealer.money -= player.currentBet;
    document.getElementById("playerMoney").innerHTML = "Player balance $" + player.money;
    document.getElementById("playerBet").innerHTML = "";

  } else {
    document.getElementById("status").innerHTML = "tie";
    player.money += player.currentBet;
    document.getElementById("playerMoney").innerHTML = "Player balance $" + player.money;
    document.getElementById("playerBet").innerHTML = "";
  }
}