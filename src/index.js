/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.css';

const calculateStateFromProps = (props) => {
  let {
    dateTo,
    dateFrom,
    numberOfFigures,
    mostSignificantFigure
  } = props;
  const currentDate = dateFrom ? new Date(dateFrom) : new Date();
  const targetDate = new Date(dateTo);
  const diff = targetDate - currentDate;
  let significance = ['year', 'month', 'day', 'hour', 'min', 'sec'];

  let year = Math.floor(diff / 31104000000);// time diff in years
  let month = Math.floor((diff / 2592000000) % 12); // time diff in months (modulated to 12)
  let day = Math.floor((diff / 86400000) % 30); // time diff in days (modulated to 30)
  let hour = Math.floor((diff / 3600000) % 24); // time diff's hours (modulated to 24)
  let min = Math.floor((diff / 60000) % 60); // time diff's minutes (modulated to 60)
  let sec = Math.floor((diff / 1000) % 60); // time diff's seconds (modulated to 60)

  if (mostSignificantFigure === 'none') {
    if (year === 0) {
      significance = significance.slice(1);
      if (month === 0) {
        significance = significance.slice(1);
        if (day === 0) {
          significance = significance.slice(1);
          if (hour === 0) {
            significance = significance.slice(1);
            if (min === 0) {
              significance = significance.slice(1);
            }
          }
        }
      }
    }
  } else {
    significance = significance.slice(significance.indexOf(mostSignificantFigure));
  }
  significance = significance.slice(0, numberOfFigures);

  if (significance.indexOf('year') === -1) {
    month += year * 12;
    year = 0;
  }
  if (significance.indexOf('month') === -1) {
    day += month * 30;
    month = 0;
  }
  if (significance.indexOf('day') === -1) {
    hour += day * 24;
    day = 0;
  }
  if (significance.indexOf('hour') === -1) {
    min += hour * 60;
    hour = 0;
  }
  if (significance.indexOf('min') === -1) {
    sec += min * 60;
    min = 0;
  }
  if (diff <= 0) props.callback();
  return {
    speed: 250,
    diff,
    significance,
    year,
    month,
    day,
    hour,
    min,
    sec
  };
};

class DateCountdown extends Component {
  constructor(props) {
    super(props);
    this.state = calculateStateFromProps(props);
    this.animateAndChangeIfNeeded = this.animateAndChangeIfNeeded.bind(this);
    this.tick = this.tick.bind(this);
    this.dissect = this.dissect.bind(this);
  }

  componentDidMount() {
    const state = calculateStateFromProps(this.props);
    const { diff } = state;
    this.setState(state, () => {
      if (diff > 0) {
        let tickId = setInterval(this.tick, 1000);
        this.setState({ tickId });
      }
    });
  }

  componentWillUnmount() {
    const { tickId } = this.state;
    clearInterval(tickId);
  }

  animateAndChangeIfNeeded(unit, prevUnit) {
    const { state, refs, props } = this;
    const { noAnimate } = props;
    let { speed, significance } = state;

    if (significance.indexOf(unit) !== -1) {
      let unitSpan = refs[unit];
      let digits = unitSpan.children;
      for (let i = 0; i < digits.length; i += 1) {
        if (i === digits.length - 1) {
          setTimeout(() => {
            if (!noAnimate) digits[i].classList.toggle('odometerEnd');
            setTimeout(() => {
              if (!noAnimate) digits[i].classList.toggle('odometerEnd');
              if (!noAnimate) digits[i].classList.toggle('odometerStart');
              if (prevUnit !== 'none') {
                let newState = {};
                newState[prevUnit] = 59;
                newState[unit] = state[unit] - 1;
                this.setState(newState);
              }
              if (!noAnimate) setTimeout(() => digits[i].classList.toggle('odometerStart'), speed);
            }, speed);
          }, 1000 - speed);
        } else {
          let allZeros = true;
          for (let j = i + 1; j < digits.length; j += 1) {
            if (digits[j].innerHTML !== '0') {
              allZeros = false;
              break;
            }
          }
          if (allZeros) {
            setTimeout(() => {
              if (!noAnimate) digits[i].classList.toggle('odometerEnd');
              setTimeout(() => {
                if (!noAnimate) digits[i].classList.toggle('odometerEnd');
                if (!noAnimate) digits[i].classList.toggle('odometerStart');
                if (prevUnit !== 'none') {
                  let newState = {};
                  newState[prevUnit] = 59;
                  newState[unit] = state[unit] - 1;
                  this.setState(newState);
                }
                if (!noAnimate) setTimeout(() => digits[i].classList.toggle('odometerStart'), speed);
              }, speed);
            }, 1000 - speed);
          }
        }
      }
    }
  }

  tick() {
    const {
      sec,
      min,
      hour,
      day,
      month,
      year,
      tickId
    } = this.state;
    const { callback } = this.props;
    const newSec = sec - 1;
    this.setState({ sec: newSec });
    this.animateAndChangeIfNeeded('sec', 'none');

    if (newSec === 0) {
      this.animateAndChangeIfNeeded('min', 'sec');

      if (min === 0) {
        this.animateAndChangeIfNeeded('hour', 'min');

        if (hour === 0) {
          this.animateAndChangeIfNeeded('day', 'hour');

          if (day === 0) {
            this.animateAndChangeIfNeeded('month', 'day');

            if (month === 0) {
              this.animateAndChangeIfNeeded('year', 'month');
            }
          }
        }
      }
    }

    if (sec === 0 && min === 0 && hour === 0 && day === 0 && month === 0 && year === 0) {
      this.setState({ diff: -1 });
      clearInterval(tickId);
      callback();
    }
  }

  dissect(value) {
    let valStr = Number(value).toString();
    if (valStr.length === 1) {
      valStr = `0${valStr}`;
    }
    return valStr.split('').map((digit, key) => <span key={key} className={key}>{digit}</span>);
  }

  render() {
    const { state } = this;
    let { significance, diff } = state;
    // eslint-disable-next-line camelcase
    let { locales, locales_plural } = this.props;
    let units = ['year', 'month', 'day', 'hour', 'min', 'sec'];

    if (diff < 0) { // past date
      return (
        <span className="odometer-block">
          {
            units.map((unit, key) => {
              if (significance.indexOf(unit) !== -1) {
                return (
                  <span key={key}>
                    00
                    {' '}
                    {locales[key]}
                    {' '}
                  </span>
                );
              }
              return null;
            })
          }
        </span>
      );
    }

    return (
      <span className="odometer-block">
        { units.map((unit, key) => {
          if (significance.indexOf(unit) !== -1) {
            return (
              <span key={key}>
                <span ref={unit} className={`${unit}`}>{this.dissect(state[unit], unit)}</span>
                {' '}
                {state[unit] <= 1 && locales[key]}
                {state[unit] > 1 && locales_plural[key]}
                {' '}
              </span>
            );
          }
          return null;
        })}
      </span>
    );
  }
}

DateCountdown.propTypes = {
  locales: PropTypes.array,
  locales_plural: PropTypes.array,
  // eslint-disable-next-line react/require-default-props
  dateTo: PropTypes.string.isRequired,
  dateFrom: PropTypes.string,
  callback: PropTypes.func,
  mostSignificantFigure: PropTypes.string,
  numberOfFigures: PropTypes.number,
  noAnimate: PropTypes.bool
};

DateCountdown.defaultProps = {
  locales: ['year', 'month', 'day', 'hour', 'minute', 'second'],
  locales_plural: ['years', 'months', 'days', 'hours', 'minutes', 'seconds'],
  dateTo: (new Date()).toString(),
  dateFrom: (new Date()).toString(),
  callback: () => null,
  mostSignificantFigure: 'none',
  numberOfFigures: 6,
  noAnimate: false,
};

export default DateCountdown;
