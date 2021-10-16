/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import Countdown from '../index';

export default {
  title: 'Example/ReactDateCountdownTimer',
  component: Countdown
};

const Template = (args) => <Countdown {...args} />;

export const Example = Template.bind({});
Example.args = {
  callback: () => console.log('Time\'s up!'),
  dateTo: '2028-03-03',
  mostSignificantFigure: 'none',
  numberOfFigures: 6,
};

export const TimesUp = Template.bind({});
TimesUp.args = {
  callback: () => console.log('Time\'s up!'),
  dateTo: '2010',
  mostSignificantFigure: 'none',
  numberOfFigures: 6,
};

export const Static = Template.bind({});
Static.args = {
  callback: () => console.log('Time\'s up!'),
  dateTo: '2010',
  mostSignificantFigure: 'none',
  numberOfFigures: 6,
  dateFrom: '2000'
};
