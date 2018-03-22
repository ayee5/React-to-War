import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function DrawButton(props) {
  return (
    <button onClick={props.onClick}>
      Draw
    </button>
  );
}

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
    this.shuffle();
  }

  initializeDeck(deckNum) {
    const suits = ["Spade", "Heart", "Club", "Diamond"];
    const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];

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

  drawCard(index) {
    return this.cards[index];
  }

  shuffle() {
    let i = 0, j = 0, temp = null;
    for (i = this.cards.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1))
      temp = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = temp;
    }
  }
}

class War extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawnCards : 0,
      deck: new Deck(props.deckNum)
    };
  }

  drawButton(props) {
    return (
      <button onClick={props.onClick}>
        Draw
      </button>
    );
  }

  onClick() {
    this.setState({drawnCards:this.state.drawnCards + 1});
  }

  render() {
    const currDeck = this.state.deck;
    const drawnCard = currDeck.drawCard(this.state.drawnCards);
    return [
      <div>
        Drawn Card is => {drawnCard.rank} of {drawnCard.suit} has value of {drawnCard.value}
      </div>,
      <DrawButton onClick={() => this.onClick()}/>
    ];
  }
}

//let testStr =  testCard.rank + " of " + testCard.suit + " has value of " + testCard.value;

ReactDOM.render(<War deckNum={1} />, document.getElementById("root"));
