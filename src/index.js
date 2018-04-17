import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import { Button } from 'react-bootstrap';
import  Deck  from './deck.js';
import  Player  from './player.js';

// use as a timer to pause animation effect
const pause = {
  one: 1000,
  two: 2500,
  three: 3500
}

function CreateButton(props) {
  return (
    <Button
      className={props.className}
      bsStyle={props.bsStyle}
      onClick={props.onClick}>{props.value}
    </Button>
  );
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
      <img
        className="maxImg" style={linkStyle}
        src={this.props.src}
        onMouseEnter={() => this.toggleHover()}
        onMouseLeave={() => this.toggleHover()}
        onClick={this.props.onClick} />
    );
  }
}

// used to display chip stack in the betting slot (tie or ante)
class ChipStack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chipcount: props.chipcount,
      denomination: [100, 25, 10, 5]
    };
  }

  /**
   * Given an amount of money (props.chipcount),
   * Calculate the optimal chip denomination of that chip stack.
   */
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

// tie and ante betting slot component
class BettingSlot extends React.Component {
  render() {
    let highlightClass = (this.props.highlight) ? "bettingSlotHighlight" : "";

    return (
      <div className="bettingSlotHolder" style={this.props.top}>
        <img
          className={["maxImg", highlightClass].join(" ")}
          src={this.props.src}
          onClick={this.props.onClick}
        />
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

  /**
   * Increase player's balance when player wins ante or tie bet
   *
   * @param {boolean} ante - ante bet
   * @param {boolean} tie - tie bet
   */
  payBet(ante, tie)
  {
    let player = this.state.player;
    player.addBetBalance(ante, tie);
    this.setState({
      player: player,
    });
  }

  /**
   * Used to show card image with a delay
   *
   * @param {boolean} dealer1st - dealer first card
   * @param {boolean} dealer2nd - dealer second card
   * @param {boolean} player1st - player first card
   * @param {boolean} player2nd - player second card
   * @param {boolean} time - the amount of millisecond to delay showing of card
   */
  showHideCardAnimation(dealer1st, dealer2nd, player1st, player2nd, time)
  {
    let player = this.state.player;
    let dealer = this.state.dealer;

    setTimeout(() => {
      dealer.setShowFirstCard(dealer1st);
      if(dealer1st == false)
      {
        dealer.setFirstCard(null);
      }

      dealer.setShowSecondCard(dealer2nd);
      if(dealer2nd == false)
      {
        dealer.setSecondCard(null);
      }

      player.setShowFirstCard(player1st);
      if(player1st == false)
      {
        player.setFirstCard(null);
      }

      player.setShowSecondCard(player2nd);
      if(player2nd == false)
      {
        player.setSecondCard(null);
      }

      this.setState({
        dealer: dealer,
        player: player
      });
    }, time);
  }

  /**
   * Player has entered war and places war bet
   */
  placeWarBet()
  {
    let player = this.state.player;
    player.setWarBet(player.getAnteBet());
    player.setBalance(player.getBalance() - player.getWarBet());
    this.setState({
      player: player,
    });
  }

  /**
   * Show amount won
   * @param {boolean} ante - show ante wager won
   * @param {boolean} tie - show tie wager won
   */
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

  /**
   * Add bet back to balance after hand is completed
   * @param {boolean} ante - add ante bet back to balance
   * @param {boolean} tie - add tie bet back to balance
   * @param {boolean} surrender - surrender status
   */
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
        // when tie is false, player is not at war. Ante/War bet can be removed.
        if(tie === false)
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

  /**
   * Repopulate original wager
   * @param {boolean} initialAnteBet - the amount to repopulate ante wager
   * @param {boolean} initialTieBet - the amount to repopulate ante wager
   * @param {boolean} surrender - repopulate wager after surrender
   */
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

  /**
   * Wrapper function that shows bet won, adds player balance, then repopuates original wager
   * @param {boolean} wonAnte - player wins ante wager
   * @param {boolean} wonTie - player wins tie wager
   * @param {boolean} war - player is in war state
   * @param {boolean} surrender - player is in surrender state
   */
  showChipStackAnimation(wonAnte, wonTie, war, surrender)
  {
    let player = this.state.player;

    if(war === false && surrender === false)
    {
      // call setPreviousTieBet so tiebet will be repoplulated with original bet size later
      player.setPreviousTieBet(player.getTieBet());
      this.setState({
        player: player
      });
    }
    // enable deal button after all cards have been dealt
    this.showButtonAfterDealing(pause.three);

    if(war === true)
    {
        this.placeWarBet();
    }

    this.showBetPaid(wonAnte, wonTie);
    this.addBetBackToBalance(wonAnte, wonTie, surrender);
    // when ante bet is 0, player is only playing tie so we can repoplulate.
    // when tie is not won then either player or dealer won so we can repopulate
    if(wonTie === false || player.getAnteBet() == 0)
    {
      // dealer and player are tied on first card. No need to repopulate bets yet
      this.repopulateInitialBet(player.getAnteBet(), player.getPreviousTieBet(), surrender);
    }
  }

  /**
   * Show buttons after hand have been completed
   * @param {integer} time - show buttons in X millisecond
   */
  showButtonAfterDealing(time)
  {
    setTimeout(() => {
      this.setState({
        showButtons: true
      });
    }, time);
  }

  /**
   * Draw first or second card
   * @param {boolean} firstCard - Draw first card when true. When false draw second card
   */
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

  /**
   * Callback to draw first card
   */
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

    // show player 1st card then show dealer 1st card after 1 sec for animation effects
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
      //when player only place a tie bet no need to go to war or surrender
      if(player.getAnteBet() == 0)
      {
        this.showHideCardAnimation(false, false, false, false, pause.two);
      }
      this.showChipStackAnimation(false, true, false, false);
    }
  }

  /**
   * Callback to go to war and draw second card
   */
  onClickWar() {
    if(this.state.drawnCards >= this.state.deck.cards.length) return;

    let player = this.state.player;
    if(player.getAnteBet() > player.getBalance())
    {
      alert("You have insufficient funds for War");
      return;
    }

    // draw second cards the run card animation
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

    // enable deal button after all cards have been dealt
    this.showButtonAfterDealing(pause.three);
  }

  /**
   * Callback to surrender
   */
  onClickSurrender() {
    if(this.state.drawnCards >= this.state.deck.cards.length) return;

    let player = this.state.player;
    player.setSurrenderStatus(true);

    this.setState({
      player: player,
      showButtons: false
    });

    // hide all card since player surrender and render chipstack
    this.showHideCardAnimation(false, false, false, false, pause.two);
    this.showChipStackAnimation(false, false, false, true);
    // enable deal button after all cards have been dealt
    this.showButtonAfterDealing(pause.two);
  }

  /**
   * Callback to remove ante or tie bet
   */
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

  /**
   * Callback to shuffle deck when empty
   */
  onClickShuffle() {
    let deckNum = this.state.deck.deckNum;
    this.setState({
      drawnCards : 0,
      deck: new Deck(deckNum),
      showButtons: true
    });
  }

  /**
   * Callback to place bet in tie or ante slot
   */
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

  /**
   * Callback to select ante or tie slot
   */
  onSelectBettingSlot() {
    this.setState({
      selectAnteSlot: !this.state.selectAnteSlot
    });
  }

  /**
   * Determine the winner at any stage of the game. Eg initial card, war, surrender, tie
   */
  determineGameStatus()
  {
    let player = this.state.player;
    let playerFirstCard = player.getFirstCard();
    let playerSecondCard = player.getSecondCard();

    let dealer = this.state.dealer;
    let dealerFirstCard = dealer.getFirstCard();
    let dealerSecondCard = dealer.getSecondCard();
    let gameStatus;

    if(dealerFirstCard.getValue() > playerFirstCard.getValue())
    {
      // dealer wins on first card
      gameStatus = "Dealer";
    }
    else if(dealerFirstCard.getValue() < playerFirstCard.getValue())
    {
      // player wins on first card
      gameStatus = "Player";
    }
    else
    {
      if(player.getSurrenderStatus() === true)
      {
        // player surrender
        gameStatus = "Dealer";
      }
      else if(playerSecondCard === null)
      {
          gameStatus = "Tied";
      }
      else
      {
        if(playerSecondCard.getValue() >= dealerSecondCard.getValue())
        {
          // player wins War
          gameStatus = "Player";
        }
        else
        {
            // Dealer wins War
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
      <CardComponent src={require('./cards/'+ dealer.getFirstCard().getImageName())} location={{top: '0', left: '8%', right: '0', bottom: '60%'}} /> : null;
    let dealer2ndCard = (dealer.getShowSecondCard()) ?
      <CardComponent src={require('./cards/'+ dealer.getSecondCard().getImageName())} location={{top: '0', left: '13%', right: '0', bottom: '55%'}} /> : null;

    // populate 2nd Card when user decides to go to War
    let player1stCard = (player.getShowFirstCard()) ?
      <CardComponent src={require('./cards/'+ player.getFirstCard().getImageName())} location={{top: '35%', left: '30%', right: '0', bottom: '0'}} /> : null;
    let player2ndCard = (player.getShowSecondCard()) ?
      <CardComponent src={require('./cards/'+ player.getSecondCard().getImageName())} location={{top: '40%', left: '35%', right: '0', bottom: '0'}} /> : null;


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

  /**
   * Render all button. Eg draw card, shuffle, clear bet, war...
   */
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
      // tied and player needs to select war or surrender
      if(playerFirstCard!= null && playerFirstCard.getValue() === dealerFirstCard.getValue() && playerSecondCard == null && player.getSurrenderStatus() === false)
      {
        buttonContainer = <div className="bottomright">
                            <CreateButton className="spacing" bsStyle="danger" onClick={() => this.onClickSurrender()} value={"Surrender"}/>
                            <CreateButton className="spacing" bsStyle="success" onClick={() => this.onClickWar()} value={"Go To War"}/>
                          </div>;
      }
      else
      {
        buttonContainer = <div>
                            {this.renderBettingChipButton()}
                            <div className="bottomright">
                              <CreateButton className="spacing" bsStyle="info" onClick={() => this.onClickShuffle()} value={"Shuffle"}/>
                              <CreateButton className="spacing" bsStyle="warning" onClick={() => this.onClickClearBet()} value={"Clear Bet"}/>
                              <CreateButton className="spacing" bsStyle="success" onClick={() => this.onClickDrawInitialCard()} value={"Deal"}/>
                            </div>
                          </div>;
      }
    }
    return buttonContainer;
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
      <div className="balanceLocation">
        <p className="balanceText">Balance: <em>{player.getBalance()}</em></p>
      </div>
    )
  }

  render() {
    return (
      <div className="main">
        <img className="table" src={require('./table/table.png')} />
        {this.renderFunctionalButton()}
        {this.renderCards()}
        {this.renderPlayerBet()}
        {this.renderBettingSlots()}
        {this.renderPlayerBalance()}
      </div>
    );
  }
}

ReactDOM.render(<War deckNum={6} />, document.getElementById("root"));
