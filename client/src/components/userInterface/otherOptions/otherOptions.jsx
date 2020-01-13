import React, { Suspense, lazy } from 'react';
import styles from "./otherOptions.css";
import moment from 'moment';
import FishIcon from './icons/fishIcon.jsx';

// const imageLen = 800;
const N = 100;
// var ratio = imageLen / N;

const saveImage = () => {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  ctx.save();
  ctx.scale(2, 2);
  ctx.transform(2, 0, 0, 2, 0, 0);
  
  var image = canvas.toDataURL('image/png');

  var fileName = `pixel-canvas-${moment().format("YYYY-MM-DD-HH-mm")}`;
  var a  = document.createElement('a');
  a.href = image;
  a.download = fileName;
  a.click();

  ctx.restore();
}

const OtherOptions = (props) => {
  return (
    <div>
      <hr className={styles.hr} />
      <button className={styles.button} onClick={saveImage}>Save Image</button>
      <div className={styles.fish_icon}>
        <FishIcon />
      </div>
    </div>
  );
};

export default OtherOptions;