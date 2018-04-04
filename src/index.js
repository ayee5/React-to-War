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
      playerCards: new Array(2),
      dealerCards: new Array(2),
      surrenderStatus: false
    };
  }

  onClickDrawInitialCard() {
    if(this.state.drawnCards >= this.state.deck.cards.length - 4) return;

    const currDeck = this.state.deck;
    const dealerFirstCard = currDeck.drawCard(this.state.drawnCards);
    const playerFirstCard = currDeck.drawCard(this.state.drawnCards+1);
    this.setState({
      drawnCards:this.state.drawnCards + 2,
      playerCards:[playerFirstCard, null],
      dealerCards:[dealerFirstCard, null],
      surrenderStatus: false
    });
  }

  onClickWar() {
    if(this.state.drawnCards >= this.state.deck.cards.length) return;

    const currDeck = this.state.deck;
    const dealerSecondCard = currDeck.drawCard(this.state.drawnCards);
    const playerSecondCard = currDeck.drawCard(this.state.drawnCards+1);
    this.setState({
      drawnCards:this.state.drawnCards + 2,
      playerCards:[this.state.playerCards[0], playerSecondCard],
      dealerCards:[this.state.playerCards[0], dealerSecondCard]
    });
  }

  onClickSurrender() {
    if(this.state.drawnCards >= this.state.deck.cards.length) return;

    this.setState({
      surrenderStatus: true
    });
  }

  onClickShuffle() {
    let deckNum = this.state.deck.deckNum;
    this.setState({
      drawnCards : 0,
      deck: new Deck(deckNum),
      playerCards: new Array(2),
      dealerCards: new Array(2),
      surrenderStatus: false
    });
  }

  determineGameStatus()
  {
    if(this.state.drawnCards == 0)//game has not started
    {
      return <p>Welcome to War</p>
    }
    else if(this.state.drawnCards >= this.state.deck.cards.length - 4) //out of cards
    {
        return  <p>Out of Cards</p>;
    }
    else if(this.state.dealerCards[0].value > this.state.playerCards[0].value) //dealer wins
    {
      return <p>Dealer Wins</p>
    }
    else if(this.state.dealerCards[0].value < this.state.playerCards[0].value) //player wins
    {
      return <p>Player Wins</p>
    }
    else
    {
        if(this.state.surrenderStatus == true)
        {
          return (
            <div>
              <p>Player loses due to Surrender</p>
            </div>
          )
        }
        else if(this.state.playerCards[1] == null) //tied
        {
            return (
              <div>
                <p>Tied</p>
              </div>
            )
        }
        else
        {
            if(this.state.playerCards[1].value >= this.state.dealerCards[1].value) //player wins War
            {
              return (
                <div>
                  <p>Player wins War</p>
                </div>
              )
            }
            else  //Dealer wins War
            {
              return (
                <div>
                  <p>Dealer wins War</p>
                </div>
              )
            }
          }
      }
  }

  renderCards() {
    if(this.state.drawnCards == 0) {
        return (
          null
        )
    }

    //populate 2nd Card when user decides to go to War
    let player2ndCard = (this.state.playerCards[1] == null) ?
      null : <img className="cards" src={require('./cards/'+ this.state.playerCards[1].imageName)} />;
    let dealer2ndCard = (this.state.dealerCards[1] == null) ?
      null : <img className="cards" src={require('./cards/'+ this.state.dealerCards[1].imageName)} />;

    return (
      <div>
        <div className="dealer1stCard">
          <img className="cards" src={require('./cards/'+ this.state.dealerCards[0].imageName)} />
        </div>
        <div className="dealer2ndCard">
          {dealer2ndCard}
        </div>
        <div className="player1stCard">
          <img className="cards" src={require('./cards/'+ this.state.playerCards[0].imageName)} />
        </div>
        <div className="player2ndCard">
          {player2ndCard}
        </div>
      </div>
    )
  }

  renderButtonLayout()
  {
    let buttonContainer;
    if(this.state.playerCards[0] == null) //initial load
    {
      buttonContainer = <div className="bottomright">
                          <CreateButton onClick={() => this.onClickDrawInitialCard()} value={"Draw Card"}/>
                        </div>;
    }
    else
    {
      if(this.state.playerCards[0].value == this.state.dealerCards[0].value && this.state.playerCards[1] == null && this.state.surrenderStatus == false) //War
      {
        buttonContainer = <div className="bottomright">
                            <CreateButton onClick={() => this.onClickWar()} value={"Go To War"}/>
                            <CreateButton onClick={() => this.onClickSurrender()} value={"Surrender"}/>
                          </div>;
      }
      else //After War or Deal next hand
      {
        buttonContainer = <div className="bottomright">
                            <CreateButton onClick={() => this.onClickDrawInitialCard()} value={"Draw Card"}/>
                          </div>;
      }
    }


    return (
        <div>
          {buttonContainer}
          <CreateButton className="bottomleft" onClick={() => this.onClickShuffle()} value={"Shuffle"}/>
        </div>
    )
  }

  render() {
    return (
      <div className="main">
        <img className="center" src={require('./cards/table.png')} />
        {this.renderButtonLayout()}
        {this.renderCards()}
        <div className="statusDiv">
          {this.determineGameStatus(this.state.dealerCards, this.state.playerCards)}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<War deckNum={4} />, document.getElementById("root"));
