import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//use as a timer to pause animation effect
const pause = {
  one: 1000,
  two: 2500,
  three: 3500
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
    this.surrenderStatus = false;
    this.warBet = 0;
    this.anteBet = 0;
    this.tieBet = 0;
    this.anteAmountWon = 0;
    this.tieAmountWon = 0;
    this.previousTieBet = 0;
    this.balance = 500;
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

  setAnteBet(bet)
  {
    this.anteBet = bet;
  }

  setTieBet(bet)
  {
    this.tieBet = bet;
  }

  setBalance(bet)
  {
    this.balance = bet;
  }

  setAnteAmountWon(amount)
  {
    this.anteAmountWon = amount;
  }

  setTieAmountWon(amount)
  {
    this.tieAmountWon = amount;
  }

  setPreviousTieBet(bet)
  {
    this.previousTieBet = bet;
  }

  setWarBet(status)
  {
    this.warBet = status;
  }

  addBetBalance(ante, tie)
  {
    if(ante === true)
    {
        let anteBet = this.getAnteBet();
        this.setBalance(this.getBalance() + anteBet);
    }
    if(tie === true)
    {
        let tieBet = this.getTieBet();
        this.setBalance(this.getBalance() + (tieBet * 10));
    }
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

  getAnteBet(bet)
  {
    return this.anteBet;
  }

  getTieBet(bet)
  {
    return this.tieBet
  }

  getBalance()
  {
    return this.balance;
  }

  getAnteAmountWon()
  {
    return this.anteAmountWon;
  }

  getTieAmountWon()
  {
    return this.tieAmountWon;
  }

  getPreviousTieBet()
  {
    return this.previousTieBet;
  }

  getWarBet()
  {
    return this.warBet;
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

class CardComponent extends React.Component {
  render() {
    return (
        <div className="cardHolder" style={this.props.location}>
            <img className="maxImg" src={this.props.src} />
        </div>
    )
  }
}

class BettingChipButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      val: props.val,
      hover: false
    };
  }

  toggleHover() {
    this.setState({
      hover: !this.state.hover
    });
  }

  render() {
    let linkStyle;
    if (this.state.hover)
    {
        linkStyle = {border: '3px solid yellow', 'border-radius': '50%'};
    }
    else
    {
        linkStyle = {border: 'none'};
    }

    return (
        <img className="maxImg" style={linkStyle} src={this.props.src}
          onMouseEnter={() => this.toggleHover()}
          onMouseLeave={() => this.toggleHover()}
          onClick={this.props.onClick} />
    );
  }
}

//used to display chip stack in the betting slot (tie or ante)
class ChipStack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chipcount: props.chipcount,
      denomination: [100, 25, 10, 5]
    };
  }

  buildChipStack()
  {
    let chipRemainder = this.props.chipcount;
    let chipStackHtml = [];
    let denomination = this.state.denomination;
    let top = this.props.top;

    for(let i = 0; i<denomination.length; i++)
    {
        let currChipCount = Math.floor(chipRemainder / denomination[i]);
        for(let t=0; t<currChipCount; t++)
        {
            let style = Object.assign({top: top+"%"}, this.props.style);
            let currChipImg = <div className={this.props.baselocation} style={style}>
                              <img className={["maxImg", "flatChipBorder"].join(' ')} src={require("./chips/" + denomination[i] + "flat.png")} />
                           </div>;
            chipStackHtml.push(currChipImg);
            top = top - 1.5;
        }
        chipRemainder = chipRemainder % denomination[i];
        if(chipRemainder === 0) break;
    }
    return chipStackHtml;
  }

  render() {
    return (
      this.buildChipStack()
    );
  }
}

class BettingSlot extends React.Component {
  render() {
    let highlightClass = (this.props.highlight) ? "bettingSlotHighlight" : "";

    return (
      <div className="bettingSlotHolder" style={this.props.top}>
        <img className={["maxImg", highlightClass].join(" ")}
             src={this.props.src}
             onClick={this.props.onClick} />
      </div>
    )
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
      showButtons: true,
      selectAnteSlot: true
    };
  }

  payBet(ante, tie)
  {
    let player = this.state.player;
    player.addBetBalance(ante, tie);
    this.setState({
      player: player,
    });
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

  placeWarBet()
  {
    let player = this.state.player;
    player.setWarBet(player.getAnteBet());
    player.setBalance(player.getBalance() - player.getWarBet());
    this.setState({
        player: player,
    });
  }

  showBetPaid(ante, tie)
  {
    let player = this.state.player;
    setTimeout(() => {
      if(ante === true)
      {
          player.setAnteAmountWon(player.getAnteBet());
      }

      if(tie === true)
      {
          player.setTieAmountWon(player.getTieBet() * 10);
      }

      this.setState({
        player: player,
      });

    }, pause.one);
  }

  addBetBackToBalance(ante, tie, surrender)
  {
    let player = this.state.player;
    setTimeout(() => {
      if(ante === true)
      {
          player.setBalance(player.getBalance() + player.getAnteBet() + player.getWarBet());
          this.payBet(true, false);
          player.setAnteAmountWon(0);
          player.setAnteBet(0);
          player.setWarBet(0);
      }
      else
      {
          if(tie === false)//when tie is false, player is not at war. Ante/War bet can be removed.
          {
              player.setAnteBet(0);
              player.setWarBet(0);
          }
      }

      if(tie === true)
      {
          player.setBalance(player.getBalance() + player.getTieBet());
          this.payBet(false, true);
          player.setTieAmountWon(0);
          player.setTieBet(0);
      }
      else
      {
          player.setTieBet(0);
      }

      this.setState({
        player: player,
      });

    }, (surrender) ? pause.one : pause.two);
  }

  repopulateInitialBet(initialAnteBet, initialTieBet, surrender)
  {
    let player = this.state.player;
    setTimeout(() => {
      if(initialAnteBet > 0 && player.getBalance() > initialAnteBet)
      {
          player.setAnteBet(initialAnteBet);
          player.setBalance(player.getBalance() - initialAnteBet);
      }

      if(initialTieBet > 0 && player.getBalance() > initialTieBet)
      {
          player.setTieBet(initialTieBet);
          player.setBalance(player.getBalance() - initialTieBet);
      }

      this.setState({
        player: player,
      });

    }, (surrender) ? pause.two : pause.three);
  }

  showChipStackAnimation(wonAnte, wonTie, war, surrender)
  {
    let player = this.state.player;

    if(war === false && surrender === false)
    {
        //call setPreviousTieBet so tiebet will be repoplulated with original bet size later
        player.setPreviousTieBet(player.getTieBet());
        this.setState({
          player: player
        });
    }
    //enable deal button after all cards have been dealt
    this.showButtonAfterDealing(pause.three);

    if(war === true)
    {
        this.placeWarBet();
    }

    this.showBetPaid(wonAnte, wonTie);
    this.addBetBackToBalance(wonAnte, wonTie, surrender);
    if(wonTie === false) //dealer and player are tied on first card. No need to repopulate bets yet
    {
        this.repopulateInitialBet(player.getAnteBet(), player.getPreviousTieBet(), surrender);
    }
  }

  showButtonAfterDealing(time)
  {
    setTimeout(() => {
      this.setState({
        showButtons: true
      });
    }, time);
  }

  drawCards(firstCard)
  {
    let dealer = this.state.dealer;
    let player = this.state.player;
    let currDeck = this.state.deck;
    let dealerCard = currDeck.drawCard(this.state.drawnCards);
    let playerCard = currDeck.drawCard(this.state.drawnCards+1);

    if(firstCard === true)
    {
      player.setFirstCard(playerCard);
      player.setSecondCard(null);
      player.setSurrenderStatus(false);
      player.setShowFirstCard(true);
      dealer.setFirstCard(dealerCard);
      dealer.setSecondCard(null);
    }
    else
    {
      player.setSecondCard(playerCard);
      player.setShowSecondCard(true);
      dealer.setSecondCard(dealerCard);
    }

    this.setState({
      drawnCards:this.state.drawnCards + 2,
      player: player,
      dealer: dealer,
      showButtons: false
    });
  }

  onClickDrawInitialCard() {
    if(this.state.drawnCards >= this.state.deck.cards.length - 4)
    {
      alert("Deck is out of cards");
      return;
    }

    let player = this.state.player;
    if(player.getAnteBet() == 0 && player.getTieBet() == 0)
    {
      alert("Place your bet");
      return;
    }

    //show player 1st card then show dealer 1st card after 1 sec for animation effects
    this.drawCards(true);
    this.showHideCardAnimation(true, false, true, false, pause.one);

    let gameStatus = this.determineGameStatus();
    if(gameStatus === "Player")
    {
      this.showHideCardAnimation(false, false, false, false, pause.two);
      this.showChipStackAnimation(true, false, false, false);

    }
    else if(gameStatus === "Dealer")
    {
      this.showHideCardAnimation(false, false, false, false, pause.two);
      this.showChipStackAnimation(false, false, false, false);
    }
    else if(gameStatus === "Tied")
    {
      this.showChipStackAnimation(false, true, false, false);
    }
  }

  onClickWar() {
    if(this.state.drawnCards >= this.state.deck.cards.length) return;

    let player = this.state.player;
    if(player.getAnteBet() > player.getBalance())
    {
        alert("You have insufficient funds for War");
        return;
    }

    //draw second cards the run card animation
    this.drawCards(false);
    this.showHideCardAnimation(true, true, true, true, pause.one);
    this.showHideCardAnimation(false, false, false, false, pause.two);

    let gameStatus = this.determineGameStatus();
    if(gameStatus === "Player")
    {
      this.showChipStackAnimation(true, false, true, false);
    }
    else if(gameStatus === "Dealer")
    {
      this.showChipStackAnimation(false, false, true, false);
    }

    //enable deal button after all cards have been dealt
    this.showButtonAfterDealing(pause.three);
  }

  onClickSurrender() {
    if(this.state.drawnCards >= this.state.deck.cards.length) return;

    let player = this.state.player;
    player.setSurrenderStatus(true);

    this.setState({
      player: player,
      showButtons: false
    });

    //hide all card since player surrender and render chipstack
    this.showHideCardAnimation(false, false, false, false, pause.two);
    this.showChipStackAnimation(false, false, false, true);
    //enable deal button after all cards have been dealt
    this.showButtonAfterDealing(pause.two);
  }

  onClickClearBet() {
    let player = this.state.player;
    let selectedBet;
    if(this.state.selectAnteSlot)
    {
        selectedBet = player.getAnteBet();
        player.setAnteBet(0);
    }
    else
    {
        selectedBet = player.getTieBet();
        player.setTieBet(0);
    }

    player.setBalance(player.getBalance() + selectedBet);
    this.setState({
      player: player
    });
  }

  onClickShuffle() {
    let deckNum = this.state.deck.deckNum;
    this.setState({
      drawnCards : 0,
      deck: new Deck(deckNum),
      showButtons: true
    });
  }

  onClickBet(bet) {
    let player = this.state.player;
    let playerBalance = player.getBalance();

    if(bet > playerBalance)
    {
      alert("You have insufficient funds");
      return;
    }
    if(this.state.selectAnteSlot)
    {
        let currAnteBet = player.getAnteBet();
        player.setAnteBet(currAnteBet + bet);
    }
    else
    {
        let currTieBet = player.getTieBet();
        player.setTieBet(currTieBet + bet);
    }

    player.setBalance(playerBalance - bet);
    this.setState({
      player: player
    });
  }

  onSelectBettingSlot() {
    this.setState({
      selectAnteSlot: !this.state.selectAnteSlot
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
        if(player.getSurrenderStatus() === true) //player surrender
        {
          gameStatus = "Dealer";
        }
        else if(playerSecondCard === null) //tied
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
    if(this.state.drawnCards === 0)
    {
        return (
          null
        )
    }
    let player = this.state.player;
    let dealer = this.state.dealer;

    let dealer1stCard = (dealer.getShowFirstCard()) ?
      <CardComponent src={require('./cards/'+ dealer.getFirstCard().imageName)} location={{top: '0', left: '8%', right: '0', bottom: '60%'}} /> : null;
    let dealer2ndCard = (dealer.getShowSecondCard()) ?
      <CardComponent src={require('./cards/'+ dealer.getSecondCard().imageName)} location={{top: '0', left: '13%', right: '0', bottom: '55%'}} /> : null;

    //populate 2nd Card when user decides to go to War
    let player1stCard = (player.getShowFirstCard()) ?
      <CardComponent src={require('./cards/'+ player.getFirstCard().imageName)} location={{top: '35%', left: '30%', right: '0', bottom: '0'}} /> : null;
    let player2ndCard = (player.getShowSecondCard()) ?
      <CardComponent src={require('./cards/'+ player.getSecondCard().imageName)} location={{top: '40%', left: '35%', right: '0', bottom: '0'}} /> : null;


    return (
      <div>
          {dealer1stCard}
          {dealer2ndCard}
          {player1stCard}
          {player2ndCard}

      </div>
    )
  }

  renderBettingChipButton()
  {
    return (
        <div className="bettingChipHolder">
            <BettingChipButton src={require('./chips/5top.png')} onClick={() => this.onClickBet(5)}/>
            <BettingChipButton src={require('./chips/10top.png')} onClick={() => this.onClickBet(10)}/>
            <BettingChipButton src={require('./chips/25top.png')} onClick={() => this.onClickBet(25)}/>
            <BettingChipButton src={require('./chips/100top.png')} onClick={() => this.onClickBet(100)}/>
        </div>
    )
  }

  renderFunctionalButton()
  {
    let buttonContainer;
    let player = this.state.player;
    let playerFirstCard = player.getFirstCard();
    let playerSecondCard = player.getSecondCard();

    let dealer = this.state.dealer;
    let dealerFirstCard = dealer.getFirstCard();

    if(this.state.showButtons)
    {
        //tied and player needs to select war or surrender
        if(playerFirstCard!= null && playerFirstCard.value === dealerFirstCard.value && playerSecondCard == null && player.getSurrenderStatus() === false) //War
        {
            buttonContainer = <div className="bottomright">
                                <CreateButton onClick={() => this.onClickWar()} value={"Go To War"}/>
                                <CreateButton onClick={() => this.onClickSurrender()} value={"Surrender"}/>
                              </div>;
        }
        else
        {
            buttonContainer = <div>
                              {this.renderBettingChipButton()}
                              <div className="bottomright">
                                 <CreateButton onClick={() => this.onClickShuffle()} value={"Shuffle"}/>
                                 <CreateButton onClick={() => this.onClickClearBet()} value={"Clear Bet"}/>
                                 <CreateButton onClick={() => this.onClickDrawInitialCard()} value={"Deal"}/>
                               </div>
                            </div>;
        }
    }
    return buttonContainer;
  }

  renderButtonLayout()
  {
    return (
        <div>
          {this.renderFunctionalButton()}
        </div>
    )
  }

  renderPlayerBet()
  {
      let player = this.state.player;
      return (
          <div>
            <ChipStack chipcount={player.getTieBet()} baselocation={"chipstack"} top={23} />
            <ChipStack chipcount={player.getTieAmountWon()} baselocation={"chipstack"} top={23} style={{right: "11%"}} />
            <ChipStack chipcount={player.getAnteBet()} baselocation={"chipstack"} top={55} />
            <ChipStack chipcount={player.getWarBet()} baselocation={"chipstack"} top={55} style={{left: "11%"}}/>
            <ChipStack chipcount={player.getAnteAmountWon()} baselocation={"chipstack"} top={55} style={{right: "11%"}} />
          </div>
      )
  }

  renderBettingSlots()
  {
      return (
        <div>
            <BettingSlot
              highlight={!this.state.selectAnteSlot}
              top={{top: '23%'}}
              src={require("./table/Tie.png")}
              onClick={() => this.onSelectBettingSlot()} />
            <BettingSlot
              highlight={this.state.selectAnteSlot}
              top={{top: '55%'}}
              src={require("./table/Ante.png")}
              onClick={() => this.onSelectBettingSlot()} />
        </div>
      )
  }

  renderPlayerBalance()
  {
      let player = this.state.player;
      return (
        <div className="chipstack">
          <p>Player's Balance {player.getBalance()}</p>
        </div>
      )
  }

  render() {
    return (
      <div className="main">
        <img className="table" src={require('./table/table.png')} />
        {this.renderButtonLayout()}
        {this.renderCards()}
        {this.renderPlayerBet()}
        {this.renderBettingSlots()}
        {this.renderPlayerBalance()}
      </div>
    );
  }
}

ReactDOM.render(<War deckNum={6} />, document.getElementById("root"));
