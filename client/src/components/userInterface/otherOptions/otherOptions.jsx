import React, { Suspense, lazy } from 'react';
import styles from "./otherOptions.css";

import FishIcon from './icons/fishIcon.jsx';

const OtherOptions = (props) => {
  return (
    <div>
      <button className={styles.button}>Save Image</button>
      <div className={styles.fish_icon}>
        <FishIcon />
      </div>
    </div>
  );
};

export default OtherOptions;