import React from 'react';
import styles from "./timer.css";
import moment from 'moment';

const timerDuration = new Date();
timerDuration.setSeconds(timerDuration.getSeconds() + 5);

class Timer extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      timerEnd: '',
      timerFace: ''
    }
    this.startTimer = this.startTimer.bind(this);
  }

  componentDidMount () {
    this.setState({
      timerEnd: new Date(),
      timerFace: new Date()
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.onCooldown !== this.props.onCooldown && this.props.onCooldown) {
      this.startTimer();
    }
  }

  startTimer () {
    var currTime = new Date();
    var timerEnd = currTime;
    timerEnd.setSeconds(timerEnd.getSeconds() + 3);
    this.setState({
      timerFace: timerEnd - currTime,
      timerEnd: timerEnd
    });

    var timerEvent = setInterval(() => {
      var currTime = new Date();
      this.setState({
        timerFace: this.state.timerEnd - currTime
      });
    }, 100);

    setTimeout(() => {
      clearInterval(timerEvent);
    }, 3000);
  }

  render () {
    // console.log(this.props.onCooldown);
    return (
      <div className={styles.timer}>
        { this.props.onCooldown &&
          <div>
            {moment(this.state.timerFace).format(`ss'SS"`)}
          </div>
        }
      </div>
    );
  }
}

export default Timer;


