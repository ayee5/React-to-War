import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const time = {
  one: 1000,
  twohalf: 2500
}

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
    this.showFirstCard = false;
    this.showSecondCard = false;
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

  setShowFirstCard(status)
  {
    this.showFirstCard = status;
  }

  setShowSecondCard(status)
  {
    this.showSecondCard = status;
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

  getShowFirstCard()
  {
    return this.showFirstCard;
  }

  getShowSecondCard()
  {
    return this.showSecondCard;
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
      showButtons: true
    };
  }

  //Add card dealing effect by using timer to show hide cards
  showHideCardAnimation(dealer1st, dealer2nd, player1st, player2nd, time)
  {
    let player = this.state.player;
    let dealer = this.state.dealer;

    setTimeout(() => {
      dealer.setShowFirstCard(dealer1st);
      dealer.setShowSecondCard(dealer2nd);
      player.setShowFirstCard(player1st);
      player.setShowSecondCard(player2nd);

      this.setState({
        dealer: dealer,
        player: player
      });
    }, time);
  }

  showButtonAfterDealing(time)
  {
    setTimeout(() => {
      this.setState({
        showButtons: true
      });
    }, time);
  }

  onClickDrawInitialCard() {
    if(this.state.drawnCards >= this.state.deck.cards.length - 4) return;

    let currDeck = this.state.deck;
    let dealerFirstCard = currDeck.drawCard(this.state.drawnCards);
    let playerFirstCard = currDeck.drawCard(this.state.drawnCards+1);

    let player = this.state.player;
    player.setFirstCard(playerFirstCard);
    player.setSecondCard(null);
    player.setSurrenderStatus(false);
    player.setShowFirstCard(true);

    let dealer = this.state.dealer;
    dealer.setFirstCard(dealerFirstCard);
    dealer.setSecondCard(null);

    this.setState({
      drawnCards:this.state.drawnCards + 2,
      player: player,
      dealer: dealer,
      showButtons: false
    });

    //enable deal button after all cards have been dealt
    this.showButtonAfterDealing(time.twohalf);
    //show player 1st card then show dealer 1st card after 1 sec for animation effects
    this.showHideCardAnimation(true, false, true, false, time.one);
    let gameStatus = this.determineGameStatus();
    if(gameStatus == "Player" || gameStatus == "Dealer")
    {
      this.showHideCardAnimation(false, false, false, false, time.twohalf);
    }
  }

  onClickWar() {
    if(this.state.drawnCards >= this.state.deck.cards.length) return;

    let currDeck = this.state.deck;
    let dealerSecondCard = currDeck.drawCard(this.state.drawnCards);
    let playerSecondCard = currDeck.drawCard(this.state.drawnCards+1);

    let player = this.state.player;
    player.setSecondCard(playerSecondCard);
    player.setShowSecondCard(true);

    let dealer = this.state.dealer;
    dealer.setSecondCard(dealerSecondCard);

    this.setState({
      drawnCards:this.state.drawnCards + 2,
      player: player,
      dealer: dealer,
      showButtons: false
    });

    //enable deal button after all cards have been dealt
    this.showButtonAfterDealing(time.twohalf);
    //show all cards then hide
    this.showHideCardAnimation(true, true, true, true, time.one);
    this.showHideCardAnimation(false, false, false, false, time.twohalf);

  }

  onClickSurrender() {
    if(this.state.drawnCards >= this.state.deck.cards.length) return;

    let player = this.state.player;
    player.setSurrenderStatus(true);

    this.setState({
      player: player,
      showButtons: false
    });

    //enable deal button after all cards have been dealt
    this.showButtonAfterDealing(time.twohalf);
    //hide all card since player surrender
    this.showHideCardAnimation(false, false, false, false, time.twohalf);

  }

  onClickShuffle() {
    let deckNum = this.state.deck.deckNum;
    this.setState({
      drawnCards : 0,
      deck: new Deck(deckNum),
      player: new Player(),
      dealer: new Player(),
      showButtons: true
    });
  }

  determineGameStatus()
  {
    let player = this.state.player;
    let playerFirstCard = player.getFirstCard();
    let playerSecondCard = player.getSecondCard();

    let dealer = this.state.dealer;
    let dealerFirstCard = dealer.getFirstCard();
    let dealerSecondCard = dealer.getSecondCard();
    let gameStatus;

    if(dealerFirstCard.value > playerFirstCard.value) //dealer wins
    {
      gameStatus = "Dealer";
    }
    else if(dealerFirstCard.value < playerFirstCard.value) //player wins
    {
      gameStatus = "Player";
    }
    else
    {
        if(player.getSurrenderStatus() == true) //player surrender
        {
          gameStatus = "Dealer";
        }
        else if(playerSecondCard == null) //tied
        {
            gameStatus = "Tied";
        }
        else
        {
            if(playerSecondCard.value >= dealerSecondCard.value) //player wins War
            {
              gameStatus = "Player";
            }
            else  //Dealer wins War
            {
              gameStatus = "Dealer";
            }
        }
      }

      return gameStatus;
  }

  renderCards() {
    if(this.state.drawnCards == 0)
    {
        return (
          null
        )
    }

    let player = this.state.player;
    let dealer = this.state.dealer;

    let player1stCard = (player.getShowFirstCard()) ?
      <img className="cards" src={require('./cards/'+ player.getFirstCard().imageName)} /> : null;
    let dealer1stCard = (dealer.getShowFirstCard()) ?
      <img className="cards" src={require('./cards/'+ dealer.getFirstCard().imageName)} /> : null;

    //populate 2nd Card when user decides to go to War
    let player2ndCard = (player.getShowSecondCard()) ?
      <img className="cards" src={require('./cards/'+ player.getSecondCard().imageName)} /> : null;
    let dealer2ndCard = (dealer.getShowSecondCard()) ?
      <img className="cards" src={require('./cards/'+ dealer.getSecondCard().imageName)} /> : null;

    return (
      <div>
        <div className="dealer1stCardHolder">
          {dealer1stCard}
        </div>
        <div className="dealer2ndCardHolder">
          {dealer2ndCard}
        </div>
        <div className="player1stCardHolder">
          {player1stCard}
        </div>
        <div className="player2ndCardHolder">
          {player2ndCard}
        </div>
      </div>
    )
  }

  renderButtonLayout()
  {
    let buttonContainer;
    let player = this.state.player;
    let playerFirstCard = player.getFirstCard();
    let playerSecondCard = player.getSecondCard();

    let dealer = this.state.dealer;
    let dealerFirstCard = dealer.getFirstCard();
    let dealerSecondCard = dealer.getSecondCard();

    if(this.state.showButtons)
    {
        //tied and player needs to select war or surrender
        if(playerFirstCard!= null && playerFirstCard.value == dealerFirstCard.value && playerSecondCard == null && player.getSurrenderStatus() == false) //War
        {
            buttonContainer = <div className="bottomright">
                                <CreateButton onClick={() => this.onClickWar()} value={"Go To War"}/>
                                <CreateButton onClick={() => this.onClickSurrender()} value={"Surrender"}/>
                              </div>;
        }
        else
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
      </div>
    );
  }
}

ReactDOM.render(<War deckNum={6} />, document.getElementById("root"));
