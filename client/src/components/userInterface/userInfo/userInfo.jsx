import React from 'react';
import styles from "./userInfo.css";

class UserInfo extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      username: '',
    }
    this.submitHandler = this.submitHandler.bind(this);
  }

  componentDidMount () {
    this.setState({
      username: this.props.userName
    });
  }

  submitHandler (event) {
    event.preventDefault();
    const userName = document.getElementById('userName');

    if (!userName.validity.valid) {
      alert('Please enter a display name.');
    } else if (userName.value.indexOf(' ') >= 0) {
      alert('No spaces allowed in display name.');
    } else {
      this.setState({
        username: userName.value
      });
      this.props.changeUserName(userName.value);
    }
  }

  render () {
    return (
      <div>
        <hr className={styles.hr} />
        <div>Display Name:</div>
        <div className={styles.username_display}>{this.state.username}</div>
        <form className={styles.form}>
          {/* <label>Change: </label> */}
          <input className={styles.textarea} type="text" id="userName" placeholder="enter new display name" required />
          &nbsp;
          <button className={styles.button} type="submit" onClick={this.submitHandler}>Submit</button>
        </form>
        <hr className={styles.hr} />
      </div>
    );
  }
}

export default UserInfo;