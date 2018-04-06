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

class Player
{
  constructor() {
    this.firstCard = null;
    this.secondCard = null;
    this.showFirst = false;
    this.showSecond = false;
    this.surrenderStatus = false
  }

  setFirstCard(card)
  {
    this.firstCard = card;
  }

  setSecondCard(card)
  {
    this.secondCard = card;
  }

  setSurrenderStatus(status)
  {
    this.surrenderStatus = status;
  }

  getFirstCard()
  {
    return this.firstCard;
  }

  getSecondCard()
  {
    return this.secondCard;
  }

  getSurrenderStatus(status)
  {
    return this.surrenderStatus;
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
      player: new Player(),
      dealer: new Player(),
    };
  }

  onClickDrawInitialCard() {
    if(this.state.drawnCards >= this.state.deck.cards.length - 4) return;

    const currDeck = this.state.deck;
    const dealerFirstCard = currDeck.drawCard(this.state.drawnCards);
    const playerFirstCard = currDeck.drawCard(this.state.drawnCards+1);

    const player = this.state.player;
    player.setFirstCard(playerFirstCard);
    player.setSecondCard(null);
    player.setSurrenderStatus(false);

    const dealer = this.state.dealer;
    dealer.setFirstCard(dealerFirstCard);
    dealer.setSecondCard(null);

    this.setState({
      drawnCards:this.state.drawnCards + 2,
      player: player,
      dealer: dealer
    });
  }

  onClickWar() {
    if(this.state.drawnCards >= this.state.deck.cards.length) return;

    const currDeck = this.state.deck;
    const dealerSecondCard = currDeck.drawCard(this.state.drawnCards);
    const playerSecondCard = currDeck.drawCard(this.state.drawnCards+1);

    const player = this.state.player;
    player.setSecondCard(playerSecondCard);

    const dealer = this.state.dealer;
    dealer.setSecondCard(dealerSecondCard);

    this.setState({
      drawnCards:this.state.drawnCards + 2,
      player: player,
      dealer: dealer
    });
  }

  onClickSurrender() {
    if(this.state.drawnCards >= this.state.deck.cards.length) return;

    const player = this.state.player;
    player.setSurrenderStatus(true);

    this.setState({
      player: player
    });
  }

  onClickShuffle() {
    let deckNum = this.state.deck.deckNum;
    this.setState({
      drawnCards : 0,
      deck: new Deck(deckNum),
      player: new Player(),
      dealer: new Player(),
    });
  }

  determineGameStatus()
  {
    const player = this.state.player;
    const playerFirstCard = player.getFirstCard();
    const playerSecondCard = player.getSecondCard();

    const dealer = this.state.dealer;
    const dealerFirstCard = dealer.getFirstCard();
    const dealerSecondCard = dealer.getSecondCard();

    if(this.state.drawnCards == 0)//game has not started
    {
      return <p>Welcome to War</p>
    }
    else if(this.state.drawnCards >= this.state.deck.cards.length - 4) //out of cards
    {
        return  <p>Out of Cards</p>;
    }
    else if(dealerFirstCard.value > playerFirstCard.value) //dealer wins
    {
      return <p>Dealer Wins</p>
    }
    else if(dealerFirstCard.value < playerFirstCard.value) //player wins
    {
      return <p>Player Wins</p>
    }
    else
    {
        if(player.getSurrenderStatus() == true)
        {
          return (
            <div>
              <p>Player loses due to Surrender</p>
            </div>
          )
        }
        else if(playerSecondCard == null) //tied
        {
            return (
              <div>
                <p>Tied</p>
              </div>
            )
        }
        else
        {
            if(playerSecondCard.value >= dealerSecondCard.value) //player wins War
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

    const player = this.state.player;
    const playerFirstCard = player.getFirstCard();
    const playerSecondCard = player.getSecondCard();

    const dealer = this.state.dealer;
    const dealerFirstCard = dealer.getFirstCard();
    const dealerSecondCard = dealer.getSecondCard();

    //populate 2nd Card when user decides to go to War
    let player2ndCard = (playerSecondCard == null) ?
      null : <img className="cards" src={require('./cards/'+ playerSecondCard.imageName)} />;
    let dealer2ndCard = (dealerSecondCard == null) ?
      null : <img className="cards" src={require('./cards/'+ dealerSecondCard.imageName)} />;

    return (
      <div>
        <div className="dealer1stCard">
          <img className="cards" src={require('./cards/'+ dealerFirstCard.imageName)} />
        </div>
        <div className="dealer2ndCard">
          {dealer2ndCard}
        </div>
        <div className="player1stCard">
          <img className="cards" src={require('./cards/'+ playerFirstCard.imageName)} />
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
    const player = this.state.player;
    const playerFirstCard = player.getFirstCard();
    const playerSecondCard = player.getSecondCard();

    const dealer = this.state.dealer;
    const dealerFirstCard = dealer.getFirstCard();
    const dealerSecondCard = dealer.getSecondCard();

    if(playerFirstCard == null) //initial load
    {
      buttonContainer = <div className="bottomright">
                          <CreateButton onClick={() => this.onClickDrawInitialCard()} value={"Draw Card"}/>
                        </div>;
    }
    else
    {
      if(playerFirstCard.value == dealerFirstCard.value && playerSecondCard == null && player.getSurrenderStatus() == false) //War
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
          {this.determineGameStatus()}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<War deckNum={4} />, document.getElementById("root"));
