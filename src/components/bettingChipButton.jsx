import React from 'react';

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
        alt=""
        className="maxImg" style={linkStyle}
        src={this.props.src}
        onMouseEnter={() => this.toggleHover()}
        onMouseLeave={() => this.toggleHover()}
        onClick={this.props.onClick} />
    );
  }
}

export default BettingChipButton;
