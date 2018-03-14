import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Card extends React.Component {
  render() {
    return (
      <div>
        {this.props.rank} of {this.props.suit} has value of {this.props.value}
      </div>
    );
  }
}

class Deck extends React.Component {

  initializeCards(deckNum) {
    const suits = ["Spade", "Heart", "Club", "Diamond"];
    const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "Ace"];

    var deckOfCards = [];
    for(let d = 0; d < deckNum; d++) {
      for (let r = 0; r < ranks.length; r++) {
        for (let s = 0; s < suits.length; s++) {
          deckOfCards.push(<Card rank={ranks[r]} suit={suits[s]} value={r} />);
        }
      }
    }

    return deckOfCards;
  }

  render() {
    return (
      this.initializeCards(this.props.num)
    );
  }
}

ReactDOM.render(<Deck num="2" />, document.getElementById("root"));
