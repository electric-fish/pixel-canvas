import React from 'react';
import styles from "./canvasInterface.css";

// var exampleArr = new ImageData(2, 2);
// var exampleArr = new Uint8ClampedArray([255, 166, 82, 255,
//                                         242, 189, 82, 255,
//                                         125, 205, 182, 255,
//                                         255, 255, 255, 255]);

class CanvasInterface extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount () {
    // const canvas = document.getElementById('canvas');
    // const ctx = canvas.getContext('2d');
    var ctx = document.getElementById('canvas').getContext('2d');

    var imageData = new ImageData(4, 4);
    var data = imageData.data;
    function paintGreen(data) {
    // data represents the Uint8ClampedArray containing the data
    // in the RGBA order [r0, g0, b0, a0, r1, g1, b1, a1, ..., rn, gn, bn, an]
      var numPixels = data.length / 4;
      console.log("numPixels: " + numPixels);
      var flag = false;
      for (let i = 0; i < numPixels; (flag) ? i+=2 : i++) {
        data[i * 4 + 1] = 255; // Green channel
        data[i * 4 + 3] = 255; // Alpha channel
        flag = !flag;
      }
      ctx.putImageData(imageData, 0, 0);
    }
    paintGreen(data);

  }

  render () {
    return (
      <div className={styles.canvas_interface}>
        <canvas className={styles.canvas} id="canvas" width={4} height={4}></canvas>
      </div>
    );
  }
}

export default CanvasInterface;