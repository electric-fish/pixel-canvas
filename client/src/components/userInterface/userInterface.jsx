import React from 'react';
import styles from "./userInterface.css";

import UserInfo from "./userInfo/userInfo.jsx";
import ColorPicker from "./colorPicker/colorPicker.jsx";
import Timer from "./timer/timer.jsx";
import OtherOptions from "./otherOptions/otherOptions.jsx";

const UserInterface = (props) => {
  // console.log(props.color);
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1 className={styles.header}>Pixel Canvas</h1>
        <p className={styles.description}>Pick a pixel. Place a pixel. Defend your pixel. Do (not) fight over pixels.</p>
      </div>
      <div className={styles.user_info}><UserInfo userName={props.userName} changeUserName={props.changeUserName} /></div>
      <div className={styles.color_picker}><ColorPicker color={props.color} changeColor={props.changeColor} /></div>
      <div className={styles.timer}><Timer onCooldown={props.onCooldown} /></div>
      <div className={styles.other_options}><OtherOptions /></div>
    </div>
  );
};

export default UserInterface;