import React from 'react';
import styles from "./canvasInterface.css";

import { canvasFunctions } from "./canvasFunctions.jsx";

const server_url = 'http://localhost:3000';
const N = 100; //row length
var ratio = 800 / N;

class CanvasInterface extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canvas_data: [],
    }
    this.getCanvas = this.getCanvas.bind(this);
    this.updateCanvas = this.updateCanvas.bind(this);
    this.zoomHandler = this.zoomHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
  }

  getCanvas() {
    return new Promise((resolve, reject) => {
      fetch(server_url + '/api/canvas', {
        method: 'GET',
        headers: {
          'content-type': 'application/json'
        }
      })
        .catch((err) => {
          console.error(err);
          reject(err);
        })
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          console.log(result);
          this.setState({
            canvas_data: result
          });
          resolve();
        });
    });
  }

  updateCanvas() {
    this.getCanvas()
      .then(() => {
        var newData = canvasFunctions.rawDataToImageData(this.state.canvas_data);
        // console.log(newData);
        var ctx = document.getElementById('canvas').getContext('2d');
        var newImageData = new ImageData(N, N);
        for (var i = 0; i < newData.length; i++) {
          newImageData.data[i] = newData[i];
        }
        ctx.putImageData(newImageData, 0, 0);
      });
  }

  componentDidMount() {
    var ctx = document.getElementById('canvas').getContext('2d');
    var imageData = new ImageData(N, N);
    var data = imageData.data;
    var setCanvas = (data) => {
      var numPixels = data.length / 4;
      for (let i = 0; i < numPixels; i++) {
        data[i * 4] = 255;
        data[i * 4 + 1] = 255;
        data[i * 4 + 2] = 255;
        data[i * 4 + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
    }
    setCanvas(data);

    this.updateCanvas();
  }

  zoomHandler(event) {
    if (event.deltaY > 0) { //scroll down -> zoom in
      // console.log(document.getElementById("canvas").style.width);
      // document.getElementById("canvas").style.width = '500px';
      // document.getElementById("canvas").style.height = '500px';
      console.log('zoom in');
    } else { //scroll up -> zoom out
      // document.getElementById("canvas").style.width = '400px';
      // document.getElementById("canvas").style.height = '400px';
      console.log('zoom out');
    }
  }

  clickHandler(event) {

    // console.log(canvasFunctions);
    const RGBA = canvasFunctions.hexToRGBA(this.props.colorHex);
    console.log(this.props.colorHex);
    console.log(RGBA);

    var canvas = document.getElementById('canvas');
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    console.log("x: " + x + " y: " + y);

    // get coordinates
    x = Math.floor(x / ratio);
    y = Math.floor(y / ratio);
    console.log("x: " + x + " y: " + y);

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    this.props.postPixelHandler(y, x);
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    var ctx = canvas.getContext('2d');
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
    imageData.data[(y * N + x) * 4 + 0] = RGBA.R_channel;
    imageData.data[(y * N + x) * 4 + 1] = RGBA.G_channel;
    imageData.data[(y * N + x) * 4 + 2] = RGBA.B_channel;
    imageData.data[(y * N + x) * 4 + 3] = 255;
    ctx.putImageData(imageData, 0, 0);
  }

  render() {
    return (
      <div className={styles.canvas_interface}>
        <canvas className={styles.canvas} id="canvas" width={N} height={N} onWheel={this.zoomHandler} onClick={this.clickHandler}><p>Please update to a browser that supports canvas.</p></canvas>
      </div>
    );
  }
}

export default CanvasInterface;