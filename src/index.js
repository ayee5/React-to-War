import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function CreateButton(props) {
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.value}
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
      playerCards: null,
      dealerCards: null
    };
  }

  onClickDrawInitial() {
    if(this.state.drawnCards >= this.state.deck.cards.length) return;

    const currDeck = this.state.deck;
    const dealerFirstCard = currDeck.drawCard(this.state.drawnCards);
    const playerFirstCard = currDeck.drawCard(this.state.drawnCards+1);
    this.setState({
      drawnCards:this.state.drawnCards + 2,
      playerCards:[playerFirstCard, null],
      dealerCards:[dealerFirstCard, null]
    });
  }

  onClickShuffle() {
    let deckNum = this.state.deck.deckNum;
    this.setState({
      drawnCards : 0,
      deck: new Deck(deckNum),
      playerCards: null,
      dealerCards: null
    });
  }

  determineGameStatus(dealerCards, playerCards)
  {
    if(this.state.drawnCards == 0)
    {
      return <p>Welcome to War</p>
    }
    if(this.state.drawnCards >= this.state.deck.cards.length)
    {
        return  <p>Out of Cards</p>;
    }
    else if(dealerCards[0].value > playerCards[0].value) {
      return <p>Dealer Wins</p>
    }
    else if (dealerCards[0].value < playerCards[0].value) {
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
          <img className="cards" src={require('./cards/'+ this.state.dealerCards[0].imageName)} />
        </div>
        <div className="playerCardHolder">
          <img className="cards" src={require('./cards/'+ this.state.playerCards[0].imageName)} />
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="main">
        <img className="center" src={require('./cards/table.png')} />
        <CreateButton className="bottomright" onClick={() => this.onClickDrawInitial()} value={"Draw Card"}/>
        <CreateButton className="bottomleft" onClick={() => this.onClickShuffle()} value={"Shuffle"}/>
        {this.renderCards()}
        <div className="statusDiv">
          {this.determineGameStatus(this.state.dealerCards, this.state.playerCards)}
        </div>
      </div>
    );
  }
}

//let testStr =  testCard.rank + " of " + testCard.suit + " has value of " + testCard.value;

ReactDOM.render(<War deckNum={1} />, document.getElementById("root"));
