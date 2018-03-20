import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Card {
  constructor(rank, suit, value) {
    this.rank = rank;
    this.suit = suit;
    this.value = value;
  }
}

class Deck {
  constructor(deckNum) {
    this.deckNum = deckNum;
    this.cards = this.initializeDeck(deckNum);
  }

  initializeDeck(deckNum) {
    const suits = ["Spade", "Heart", "Club", "Diamond"];
    const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "Ace"];

    var deckOfCards = [];
    for(let d = 0; d < deckNum; d++) {
      for (let r = 0; r < ranks.length; r++) {
        for (let s = 0; s < suits.length; s++) {
          deckOfCards.push(new Card(ranks[r], suits[s], r));
        }
      }
    }

    return deckOfCards;
  }
}

let deck = new Deck(2);
let testCard = deck.cards[2];
let testStr =  testCard.rank + " of " + testCard.suit + " has value of " + testCard.value;

ReactDOM.render(testStr, document.getElementById("root"));
