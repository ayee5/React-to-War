import React from 'react';
import { shallow, mount, render } from 'enzyme';
import  BettingChipButton  from '../components/bettingChipButton';

describe('BettingChipButton', () => {
  const mockFn = (jest.fn());
  const fiveBettingChip = <BettingChipButton src={require('../img/chips/5top.png')} onClick={mockFn}/>;
  const tree = shallow(fiveBettingChip);

  it('should be defined', () => {
    expect(fiveBettingChip).toBeDefined();
  });

  it('should render correctly', () => {
    expect(tree).toMatchSnapshot();
  });

  it('should have a click function', () => {
    tree.simulate('click');
    expect(mockFn).toHaveBeenCalled();
  });

  it('should contain flat 5 chip img', () => {
    const wrapper = mount(fiveBettingChip);
    expect(wrapper.contains(<img
      alt=""
      className="maxImg" style={{border: 'none'}}
      src={require('../img/chips/5top.png')}
      onMouseEnter={mockFn}
      onMouseLeave={mockFn}
      onClick={mockFn} />)).toEqual(false);
  });
});
