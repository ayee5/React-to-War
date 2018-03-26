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
    this.imageName = rank+suit+'.png';
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
    const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

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
    this.setState({drawnCards:this.state.drawnCards + 2});
  }

  determineGameStatus(dealerCard, playerCard)
  {
    if(dealerCard.value > playerCard.value) {
      return <p>Dealer Wins</p>
    }
    else if (dealerCard.value < playerCard.value) {
      return <p>Player Wins</p>
    }
    else {
      return (
        <div>
          <p>Tied</p>
          <button>Go to War</button>
          <button>Surrender</button>
        </div>
      )
    }
  }

  render() {
    const currDeck = this.state.deck;
    const dealerCard = currDeck.drawCard(this.state.drawnCards);
    const playerCard = currDeck.drawCard(this.state.drawnCards+1);
    return (
      <div className="main">
        <img className="center" src={require('./cards/table.png')} />
        <div className="dealerCardHolder">
          <img className="cards" src={require('./cards/'+dealerCard.imageName)} />
        </div>
        <div className="playerardHolder">
          <img className="cards" src={require('./cards/'+playerCard.imageName)} />
        </div>
        <div className="statusDiv">
          {this.determineGameStatus(dealerCard, playerCard)}
          <DrawButton onClick={() => this.onClick()}/>
        </div>
      </div>
    );
  }
}

//let testStr =  testCard.rank + " of " + testCard.suit + " has value of " + testCard.value;

ReactDOM.render(<War deckNum={1} />, document.getElementById("root"));
