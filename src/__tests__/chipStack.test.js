import React from 'react';
import { shallow, mount, render } from 'enzyme';
import ChipStack from '../components/ChipStack.jsx';

describe('ChipStack', () => {
  const stackOfFifteen = <ChipStack chipcount={15} baselocation={"chipstack"} top={23} />;
  it('should be defined', () => {
    expect(stackOfFifteen).toBeDefined();
  });

  it('should render correctly', () => {
    const tree = shallow(stackOfFifteen);
    expect(tree).toMatchSnapshot();
  });
});
