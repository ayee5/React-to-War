class Card {
  constructor(rank, suit, value) {
    this.rank = rank;
    this.suit = suit;
    this.value = value;
    this.imageName = rank+suit+'.png';
  }

  getRank()
  {
    return this.rank;
  }

  getSuit()
  {
    return this.suit;
  }

  getValue()
  {
    return this.value;
  }

  getImageName()
  {
    return this.imageName;
  }
}

export default Card;
