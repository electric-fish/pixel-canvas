import React from 'react';
import styles from "./canvasInterface.css";

const N = 2 * 2;

class CanvasInterface extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.zoomHandler = this.zoomHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
  }

  componentDidMount () {
    var ctx = document.getElementById('canvas').getContext('2d');

    var imageData = new ImageData(4, 4);
    var data = imageData.data;
    function paintGreen(data) {
    // data represents the Uint8ClampedArray containing the data
    // in the RGBA order [r0, g0, b0, a0, r1, g1, b1, a1, ..., rn, gn, bn, an]
      var numPixels = data.length / 4;
      // console.log("numPixels: " + numPixels);
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

  zoomHandler (event) {
    if (event.deltaY > 0) { //scroll down -> zoom in
      console.log(document.getElementById("canvas").style.width);
      document.getElementById("canvas").style.width = '500px';
      document.getElementById("canvas").style.height = '500px';
      console.log('zoom in');
    } else { //scroll up -> zoom out
      document.getElementById("canvas").style.width = '400px';
      document.getElementById("canvas").style.height = '400px';
      console.log('zoom out');
    }
  }

  clickHandler (event) {
    var canvas = document.getElementById('canvas');
    var rect = canvas.getBoundingClientRect();    
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    console.log("x: " + x + " y: " + y);

    // get coordinates
    x = Math.floor(x / 100);
    y = Math.floor(y / 100);
    console.log("x: " + x + " y: " + y);

    var ctx = canvas.getContext('2d');
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
    imageData.data[(y * N + x) * 4 + 0] = 60;
    imageData.data[(y * N + x) * 4 + 1] = 60;
    imageData.data[(y * N + x) * 4 + 2] = 60;
    imageData.data[(y * N + x) * 4 + 3] = 255;
    ctx.putImageData(imageData, 0, 0);
  }

  render () {
    return (
      <div className={styles.canvas_interface}>
        <canvas className={styles.canvas} id="canvas" width={4} height={4} onWheel={this.zoomHandler} onClick={this.clickHandler}></canvas>
      </div>
    );
  }
}

export default CanvasInterface;