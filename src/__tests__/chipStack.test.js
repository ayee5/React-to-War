import React from 'react';
import { shallow, mount, render } from 'enzyme';
import ChipStack from '../components/ChipStack.jsx';

describe('ChipStack', () => {
  const stackOfFourty = <ChipStack chipcount={40} baselocation={"chipstack"} top={23} />;
  it('should be defined', () => {
    expect(stackOfFourty).toBeDefined();
  });

  it('should render correctly', () => {
    const tree = shallow(stackOfFourty);
    expect(tree).toMatchSnapshot();
  });

  it('40 chipstack should only contain a 5, 10, 25 chip', () => {
    const wrapper = mount(stackOfFourty);
    expect(wrapper.contains(<img className="maxImg flatChipBorder" src={require("../img/chips/5flat.png")} />)).toEqual(true);
    expect(wrapper.contains(<img className="maxImg flatChipBorder" src={require("../img/chips/10flat.png")} />)).toEqual(true);
    expect(wrapper.contains(<img className="maxImg flatChipBorder" src={require("../img/chips/25flat.png")} />)).toEqual(true);
    expect(wrapper.contains(<img className="maxImg flatChipBorder" src={require("../img/chips/100flat.png")} />)).toEqual(false);
  });

  it('10 chipstack should only contain a 10 chip', () => {
    const stackOfTen = <ChipStack chipcount={10} baselocation={"chipstack"} top={23} />;
    const wrapper = mount(stackOfTen);
    expect(wrapper.contains(<img className="maxImg flatChipBorder" src={require("../img/chips/5flat.png")} />)).toEqual(false);
    expect(wrapper.contains(<img className="maxImg flatChipBorder" src={require("../img/chips/10flat.png")} />)).toEqual(true);
  });
});
