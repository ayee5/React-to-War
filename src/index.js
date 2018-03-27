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
      deck: new Deck(props.deckNum),
      playerCard: null,
      dealerCard: null
    };
  }

  drawButton(props) {
    return (
      <button onClick={props.onClick}>
        Shuffle Deck
      </button>
    );
  }

  drawButton(props) {
    return (
      <button onClick={props.onClick}>
        Draw
      </button>
    );
  }

  onClick() {
    const currDeck = this.state.deck;
    const dealerCard = currDeck.drawCard(this.state.drawnCards);
    const playerCard = currDeck.drawCard(this.state.drawnCards+1);
    this.setState({
      drawnCards:this.state.drawnCards + 2,
      playerCard:playerCard,
      dealerCard:dealerCard
    });
  }

  determineGameStatus(dealerCard, playerCard)
  {
    if(this.state.drawnCards == 0)
    {
      return <p>Welcome to War</p>
    }
    else if(dealerCard.value > playerCard.value) {
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

  renderCards() {
    if(this.state.drawnCards == 0) {
        return (
          null
        )
    }

    return (
      <div>
        <div className="dealerCardHolder">
          <img className="cards" src={require('./cards/'+ this.state.dealerCard.imageName)} />
        </div>
        <div className="playerardHolder">
          <img className="cards" src={require('./cards/'+ this.state.playerCard.imageName)} />
        </div>
      </div>
    )
  }

  render() {

    return (
      <div className="main">
        <img className="center" src={require('./cards/table.png')} />
        {this.renderCards()}
        <div className="statusDiv">
          {this.determineGameStatus(this.state.dealerCard, this.state.playerCard)}
          <DrawButton onClick={() => this.onClick()}/>
        </div>
      </div>
    );
  }
}

//let testStr =  testCard.rank + " of " + testCard.suit + " has value of " + testCard.value;

ReactDOM.render(<War deckNum={1} />, document.getElementById("root"));
