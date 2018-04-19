import React from 'react';
import ReactDOM from 'react-dom';

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
                            <img className={["maxImg", "flatChipBorder"].join(' ')} src={require("../img/chips/" + denomination[i] + "flat.png")} />
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

export default ChipStack;
