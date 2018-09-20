import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.css';

const calculateStateFromProps = (props) => {
    let { dateTo, numberOfFigures, mostSignificantFigure } = props;
    const currentDate = new Date();
    const targetDate = new Date(dateTo);
    const diff = targetDate-currentDate;
    var significance = ['year','month','day','hour','min','sec'];

    let year= Math.floor(diff/31104000000);// time diff in years
    let month= Math.floor((diff/2592000000)%12); // time diff in months (modulated to 12)
    let day= Math.floor((diff/86400000)%30); // time diff in days (modulated to 30)
    let hour= Math.floor((diff/3600000)%24); // time diff's hours (modulated to 24)
    let min= Math.floor((diff/60000)%60); // time diff's minutes (modulated to 60)
    let sec= Math.floor((diff/1000)%60); // time diff's seconds (modulated to 60)

    var timeoutList = [];

    if(mostSignificantFigure === 'none'){
        if(year === 0){
            significance=significance.slice(1);
            if(month === 0){
                significance=significance.slice(1);
                if(day === 0){
                    significance=significance.slice(1);
                    if(hour === 0){
                        significance=significance.slice(1);
                        if(min === 0){
                            significance=significance.slice(1);
                        }
                    }
                }
            }
        }
    }
    else{
        significance = significance.slice(significance.indexOf(mostSignificantFigure));
    }
    significance = significance.slice(0,numberOfFigures);


    if(significance.indexOf('year')===-1){
        month += year*12;
        year = 0;
    }
    if(significance.indexOf('month')===-1){
        day += month*30;
        month = 0;
    }
    if(significance.indexOf('day')===-1){
        hour += day*24;
        day = 0;
    }
    if(significance.indexOf('hour')===-1){
        min += hour*60;
        hour = 0;
    }
    if(significance.indexOf('min')===-1){
        sec += min*60;
        min = 0;
    }
    if(diff <= 0 ) props.callback();
    return {
        speed:250,
        diff: diff,
        significance: significance,
        year: year,
        month: month,
        day: day,
        hour: hour,
        min: min,
        sec: sec
    };
}

class DateCountdown extends Component {

    componentDidMount(){
        this.setState(calculateStateFromProps(this.props), ()=>{
            if(this.state.diff > 0){
                var tickId = setInterval(this.tick,1000);
                this.setState({tickId:tickId});
            }
        });
    }

    static getDerivedStateFromProps(props, state){
        let newState = calculateStateFromProps(props);
        return newState
    }

    componentWillUnmount(){
        clearInterval(this.state.tickId)
        timeoutList.forEach(x=>{
            clearTimeout(x);
        })
    }


    animateAndChangeIfNeeded = (unit,prevUnit) => {
        let {speed, significance} = this.state;

        if(significance.indexOf(unit) !== -1){
            let unitSpan = document.getElementsByClassName(unit)[0];
            let digits = unitSpan.children;
            for(let i = 0; i < digits.length; i++){

                if(i === digits.length-1){
                    this.timeoutList.push(setTimeout(()=>{
                        digits[i].classList.toggle('odometerEnd');
                        this.timeoutList.push(setTimeout(()=> {
                            digits[i].classList.toggle('odometerEnd')
                            digits[i].classList.toggle('odometerStart')
                            if(prevUnit!=='none'){
                                let newState = {};
                                newState[prevUnit]=59;
                                newState[unit]=this.state[unit]-1;
                                this.setState(newState);
                            }
                            this.timeoutList.push(setTimeout(()=>digits[i].classList.toggle('odometerStart'),speed));

                        },speed));
                    },1000-speed))
                }else{
                    let allZeros = true;
                    for(let j = i+1; j < digits.length; j++){
                        if(digits[j].innerHTML === '0'){
                            allZeros = true;
                        }else{
                            allZeros = false;
                            break;
                        }
                    }
                    if(allZeros){
                        this.timeoutList.push(setTimeout(()=>{
                            digits[i].classList.toggle('odometerEnd');
                            this.timeoutList.push(setTimeout(()=> {
                                digits[i].classList.toggle('odometerEnd')
                                digits[i].classList.toggle('odometerStart')
                                if(prevUnit!=='none'){
                                    let newState = {};
                                    newState[prevUnit]=59;
                                    newState[unit]=this.state[unit]-1;
                                    this.setState(newState);
                                }
                                this.timeoutList.push(setTimeout(()=>digits[i].classList.toggle('odometerStart'),speed));
                            },speed));
                        },1000-speed))
                    }
                }

            }
        }
    }

    tick = () => {
        this.setState({sec:this.state.sec-1})
        this.animateAndChangeIfNeeded('sec','none')

        if(this.state.sec === 0){
            this.animateAndChangeIfNeeded('min','sec');

            if(this.state.min === 0){
                this.animateAndChangeIfNeeded('hour','min');

                if(this.state.hour === 0){
                    this.animateAndChangeIfNeeded('day','hour');

                    if(this.state.day === 0){
                        this.animateAndChangeIfNeeded('month','day');

                        if(this.state.month === 0){
                            this.animateAndChangeIfNeeded('year','month');
                        }
                    }
                }
            }
        }

        if(this.state.sec === 0 && this.state.min === 0 && this.state.hour === 0 && this.state.day === 0 && this.state.month === 0 && this.state.year === 0){
            this.setState({diff:-1})
            clearInterval(this.state.tickId);
            this.props.callback();
        }
    }

    dissect = (value,unit) =>{
        let valStr = Number(value).toString();
        if(valStr.length === 1){
            valStr = `0${valStr}`;
        }
        return valStr.split('').map((digit,key)=> <span key={key} className={key} >{digit}</span>);
    }

    render(){
        let { significance } = this.state;
        let { locales, locales_plural } = this.props;
        let units = ['year','month','day','hour','min','sec'];

        if(this.state.diff < 0){ // past date
            return (
                <span className="odometer-block">
                    {
                        units.map((unit,key)=>{
                            if(significance.indexOf(unit) !== -1)
                            {return (<span key={key}>0 {locales[key]} </span>)}
                            else return null;
                        })
                    }
                </span>
            )
        }
        else{
            return (
                <span className="odometer-block">
                    { units.map((unit,key)=>{
                        if(significance.indexOf(unit) !== -1)
                        {
                            return (<span key={key}><span className={`${unit}`} >{this.dissect(this.state[unit],unit)}</span> {this.state[unit]<=1 && locales[key]}{this.state[unit]>1 && locales_plural[key]}{` `}</span>);
                        }
                        else return null;
                    })}
                </span>
            );
        }
    }
}

DateCountdown.propTypes = {
    locales: PropTypes.array,
    locales_plural: PropTypes.array,
    dateTo: PropTypes.string.isRequired,
    callback: PropTypes.func,
    mostSignificantFigure: PropTypes.string,
    numberOfFigures: PropTypes.number
}

DateCountdown.defaultProps = {
    locales: ['year','month','day','hour','minute','second'],
    locales_plural: ['years','months','days','hours','minutes','seconds'],
    dateTo: (new Date()).toString(),
    callback: ()=>null,
    mostSignificantFigure: 'none',
    numberOfFigures: 6
}


export default DateCountdown;
