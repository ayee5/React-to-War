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

  /**
   * Add bet to player's balance
   *
   * @param {boolean} ante - add ante bet to balance
   * @param {boolean} tie - add tie bet to balance
   */
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

export default Player;
