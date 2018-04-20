import React from 'react';
import { shallow, mount, render } from 'enzyme';
import War from '../components/war.jsx';

describe('War', () => {
  const oneDeckWar = <War deckNum={1} />;
  it('should be defined', () => {
    expect(oneDeckWar).toBeDefined();
  });

  it('should render correctly', () => {
    const tree = shallow(oneDeckWar);
    expect(tree).toMatchSnapshot();
  });

  const warMount = mount(<War deckNum={1} />);
  it('should have place ante and tie bet', () => {
     let player = warMount.state().player;
     let bet5Button = warMount.find('img[src="5top.png"]').at(0);
     let bet10Button = warMount.find('img[src="10top.png"]').at(0);
     let tieSlot = warMount.find('img[src="Tie.png"]').at(0);

     // place 5 on ante bet
     bet5Button.simulate('click');
     expect(player.getBalance()).toEqual(495);
     expect(player.getAnteBet()).toEqual(5);

     // place 10 on tie bet
     tieSlot.simulate('click');
     bet10Button.simulate('click');
     expect(player.getBalance()).toEqual(485);
     expect(player.getTieBet()).toEqual(10);
  });


  it('ante and tie bet should be removed', () => {
     let player = warMount.state().player;
     let tieSlot = warMount.find('img[src="Tie.png"]').at(0);
     let clearBet = warMount.find('button').at(1);

     // clear 10 tie bet
     clearBet.simulate('click');
     expect(player.getBalance()).toEqual(495);
     expect(player.getTieBet()).toEqual(0);

     // clear 5 ante bet
     tieSlot.simulate('click');
     clearBet.simulate('click');
     expect(player.getBalance()).toEqual(500);
     expect(player.getAnteBet()).toEqual(0);
  });

  it('cards should have been deal', () => {
     let deal = warMount.find('button').at(2);
     let bet5Button = warMount.find('img[src="5top.png"]').at(0);
     let player = warMount.state().player;
     let dealer = warMount.state().dealer;

     // player and dealer should not have cards yet
     expect(player.getFirstCard()).toBeFalsy();
     expect(dealer.getFirstCard()).toBeFalsy();

     // place 5 on ante bet and deal cards
     bet5Button.simulate('click');
     deal.simulate('click');

     // player and dealer should have cards yet
     expect(player.getFirstCard()).toBeTruthy();
     expect(dealer.getFirstCard()).toBeTruthy();
  });
});
