// global vairables
//const beginGame = document.getElementById("beginGame");
var gameDeck = [];
var btnNew = document.getElementById("beginGame");

btnNew.addEventListener("click", beginGame);

class Player {
  constructor(name, hand, cardTotal, currentBet, balance) {
    this.name = name;
    this.hand = hand;
    this.cardTotal = cardTotal;
    this.currentBet = currentBet;
    this.money = balance;
  };
};

let player = new Player("player", [], 0, 0, 100);
let dealer = new Player("dealer", [], 0, 0, 1000);

function buildDeck() {
  gameDeck = [
    ["c2", 2], ["c3", 3], ["c4", 4], ["c5", 5], ["c6", 6], ["c7", 7], ["c8", 8], ["c9", 9], ["c10", 10], ["cj", 10], ["cq", 10], ["ck", 10], ["ca", 11],
    ["d2", 2], ["d3", 3], ["d4", 4], ["d5", 5], ["d6", 6], ["d7", 7], ["d8", 8], ["d9", 9], ["d10", 10], ["dj", 10], ["dq", 10], ["dk", 10], ["da", 11],
    ["h2", 2], ["h3", 3], ["h4", 4], ["h5", 5], ["h6", 6], ["h7", 7], ["h8", 8], ["h9", 9], ["h10", 10], ["hj", 10], ["hq", 10], ["hk", 10], ["ha", 11],
    ["s2", 2], ["s3", 3], ["s4", 4], ["s5", 5], ["s6", 6], ["s7", 7], ["s8", 8], ["s9", 9], ["s10", 10], ["sj", 10], ["sq", 10], ["sk", 10], ["sa", 11]
  ];
  return gameDeck;
};

function shuffleDeck(deck) {

  for (let i = 0; i < deck.length; i++) {
    const newIndex = Math.floor(Math.random() * (i + 1));
    const oldValue = deck[newIndex];
    deck[newIndex] = deck[i];
    deck[i] = oldValue;
  };
  return deck;
};

function resetGame() {
  document.getElementById("beginGame").innerHTML = "Play again?";
  document.getElementById("dealerTotal").innerHTML = "";
  document.getElementById("result").src = "";
  player.hand = [];
  player.cardTotal = 0;
  dealer.hand = [];
  dealer.cartTotal = 0;
  player.currentBet = 10;
  player.money -= player.currentBet;
  gameDeck = shuffleDeck(buildDeck());
  //remove image sources.
  for (let i = 0; i < 7; i++) {
    document.getElementById('dealerCard' + (i + 1)).src = "";
    document.getElementById('playerCard' + (i + 1)).src = "";
  };

  //deal initial cards alternating player/dealer.  Make this a function when adding more players.
  oneToPlayer();
  oneToDealer();
  oneToPlayer();
  oneToDealer();
  document.getElementById("playerBet").innerHTML = "Your Current Bet: $" + player.currentBet;
  document.getElementById("playerMoney").innerHTML = "Player balance $" + player.money;
};

function calcHand(hand) {
  let aceCount = 0;
  let total = 0;
  for (let i = 0; i < hand.length; i++) {
    const currentCard = hand[i];

    if (currentCard[1] == 11) {
      aceCount += 1;
      total += 11;
    } else {
      total += (currentCard[1]);
    };
  }
  if (aceCount > 0 && total > 21) {
    total = total - 10;
    if (total > 21 && aceCount > 1) {
      total = total - 10;
    }
  }
  return total;
};

function oneToPlayer() {
  
  //const test = $(`#playerCard ${imageSlot}`).src = `/cardImg/ ${currentCard[0]}.png`;
  //console.log(test)

  //take card from deck and give it to player
  player.hand.push(gameDeck.shift());

  //which card just got added 1-7, and then assign the card's array to current card.
  const currentCard = (player.hand[(player.hand.length - 1)]);
  const imageSlot = (player.hand.length);

  //assign image to corresponding div.  The first command didn't work, find out why.
  //document.getElementById (`playerCard ${imageSlot}`).src = `/cardImg/ ${currentCard[0]}.png`;
  document.getElementById('playerCard' + imageSlot).src = "/cardImg/" + (currentCard[0]) + ".png";

  updatePlayerHand();

  //allow hit or double bet.
  if (player.cardTotal >= 21) { document.getElementById("hit").disabled = true };
  if (player.hand.length > 2) { document.getElementById("doubleBet").disabled = true };
};

function oneToDealer() {
  
  dealer.hand.push(gameDeck.shift());
  if (dealer.hand.length != 2) {
  const currentCard = (dealer.hand[(dealer.hand.length - 1)]);
  const imageSlot = (dealer.hand.length);
  document.getElementById('dealerCard' + imageSlot).src = "/cardImg/" + (currentCard[0]) + ".png";
  } else {
    document.getElementById('dealerCard2').src = "/cardImg/cardBack.png";
  };
};

function doubleBet() {
  player.money -= player.currentBet;
  player.currentBet *= 2;
  document.getElementById("playerBet").innerHTML = "Your Current Bet: $" + player.currentBet;
  document.getElementById("playerMoney").innerHTML = "Player balance $" + player.money;
  document.getElementById("doubleBet").disabled = true;
};

function updatePlayerHand() {
  player.cardTotal = calcHand(player.hand);
  document.getElementById("playerTotal").innerHTML = "Player total: " + (player.cardTotal);
  if (player.total >= 21) {
    finishGame();
  } else {
    document.getElementById("hit").disabled = false;
    document.getElementById("stay").disabled = false;
  };
};

function updateDealerHand() {
  dealer.cardTotal = calcHand(dealer.hand);
  document.getElementById("dealerTotal").innerHTML = "Dealer total: " + dealer.cardTotal;
};

function beginGame() {
  if (player.money >= 20) {
    document.getElementById("doubleBet").disabled = false;
  };

  document.getElementById("beginGame").disabled = true;
  resetGame();
  document.getElementById("hit").disabled = false;
  document.getElementById("stay").disabled = false;
  updatePlayerHand();

  document.getElementById("status").innerHTML = "Decisions Decisions..."
  var hit = document.getElementById("hit");
  hit.addEventListener("click", oneToPlayer);

  var stay = document.getElementById("stay");
  stay.addEventListener("click", finishGame);

  var doubleBetQuestion = document.getElementById("doubleBet");
  doubleBetQuestion.addEventListener("click", doubleBet);
};

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
    document.getElementById("result").src = "/cardImg/noMoney.gif";
  };
};

function dealerTurn() {
  const currentCard = (dealer.hand[(dealer.hand.length - 1)]);
  document.getElementById('dealerCard2').src = "/cardImg/" + (currentCard[0]) + ".png";

  while ((dealer.cardTotal < 17 && player.cardTotal <= 21) && (dealer.cardTotal <= player.cardTotal)) {
    oneToDealer();
    updateDealerHand();
  };
};

function gameResult() {
  if (player.cardTotal > 21 || (dealer.cardTotal > player.cardTotal && dealer.cardTotal <= 21)) {
    document.getElementById("status").innerHTML = ("Dealer wins." + " You Lost $" + player.currentBet);
    dealer.money += player.currentBet;
    document.getElementById("playerMoney").innerHTML = "Player balance $" + player.money;
    document.getElementById("playerBet").innerHTML = "";
    document.getElementById("result").src = "/cardImg/loser.gif";

  } else if (player.cardTotal <= 21 && dealer.cardTotal > 21 || (dealer.cardTotal < player.cardTotal && player.cardTotal <= 21)) {
    document.getElementById("status").innerHTML = ("You win" + " $" + player.currentBet);
    player.money += (player.currentBet * 2);
    dealer.money -= player.currentBet;
    document.getElementById("playerMoney").innerHTML = "Player balance $" + player.money;
    document.getElementById("playerBet").innerHTML = "";
    document.getElementById("result").src = "/cardImg/kip.gif";
  } else {
    document.getElementById("status").innerHTML = "tie";
    player.money += player.currentBet;
    document.getElementById("playerMoney").innerHTML = "Player balance $" + player.money;
    document.getElementById("playerBet").innerHTML = "";
    document.getElementById("result").src = "";
  }
};

