# react-date-countdown-timer
A basic react countdown timer component with a cool CSS transition animation.
## Installation
> npm install --save react-date-countdown-timer
## Usage
```javascript
import DateCountdown from 'react-date-countdown-timer';
// ...
return <DateCountdown dateTo='2023-01-01 00:00:00 GMT+0300' callback={()=>alert('Hello')}  />;
```
## Properties
* dateTo(string)(required): target date to countdown
* dateFrom(string): date to countdown from (default current date)
* callback(function): function to run after the countdown is completed (default null)
* mostSignificantFigure(string): most significant figure to show about the remaining time (default 'none')
* numberOfFigures(number): number of figures to show from mostSignificantFigure (default 6)

mostSignificantFigure can be one of these values:
* year
* month
* day
* hour
* minute
* second
* none (shows as many figures as available)
