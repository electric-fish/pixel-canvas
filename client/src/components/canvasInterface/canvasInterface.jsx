import React from 'react';
import styles from "./canvasInterface.css";
import moment from 'moment';

import { canvasFunctions } from "./canvasFunctions.jsx";

const server_url = 'http://localhost:3000';
const N = 100; //row length
var ratio = 800 / N;

class CanvasInterface extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canvas_data: [],
      cursor_rowNum: 0,
      cursor_colNum: 0,
      cursor_lastEditedAt: '',
      cursor_lastEditedBy: '',
      mouseOnCanvas: false,
      zoomedIn: false,
      zoomedInRowNum: 0,
      zoomedInColNum: 0,
    }
    this.getCanvas = this.getCanvas.bind(this);
    this.updateCanvas = this.updateCanvas.bind(this);
    this.zoomHandler = this.zoomHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.hoverHandler = this.hoverHandler.bind(this);
    this.dragStart = this.dragStart.bind(this);
    this.mouseEnterLeaveHandler = this.mouseEnterLeaveHandler.bind(this);
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
          // console.log(result);
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
    this.interval = setInterval(() => {
      this.updateCanvas();
    }, 1000);

  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  zoomHandler(event) {
    if (event.deltaY > 0) { //scroll down
      console.log('zoom out');
      if (this.state.zoomedIn) {
        this.setState({
          zoomedIn: false,
          zoomedInRowNum: 0,
          zoomedInColNum: 0,
        });
        var canvas = document.getElementById("canvas");
        canvas.width *= 2;
        canvas.height *= 2;
      }
    } else { //scroll up
      console.log('zoom in');
      if (!this.state.zoomedIn) {
        this.setState({
          zoomedIn: true
        });
        var canvas = document.getElementById("canvas");
        canvas.width /= 2;
        canvas.height /= 2;
      }
    }
  }

  clickHandler(event) {
    const RGBA = canvasFunctions.hexToRGBA(this.props.colorHex);
    console.log(this.props.colorHex);
    console.log(RGBA);

    var canvas = document.getElementById('canvas');
    this.props.postPixelHandler(this.state.cursor_rowNum, this.state.cursor_colNum);
    this.updateCanvas();
  }

  hoverHandler () {
    if (!this.state.zoomedIn) {
      var canvas = document.getElementById('canvas');
      var rect = canvas.getBoundingClientRect();
      var rowNum = event.clientY - rect.top;
      var colNum = event.clientX - rect.left;
      // console.log(rowNum + ', ' + colNum);
      rowNum = (rowNum > 0) ? Math.floor(rowNum / ratio) : 0;
      colNum = (colNum > 0) ? Math.floor(colNum / ratio) : 0;
      this.setState({
        cursor_rowNum: rowNum,
        cursor_colNum: colNum,
        cursor_lastEditedBy: this.state.canvas_data[this.state.cursor_rowNum * N + this.state.cursor_colNum].lastEditedBy,
        cursor_lastEditedAt: this.state.canvas_data[this.state.cursor_rowNum * N + this.state.cursor_colNum].lastEditedAt,
      }); 
    } else {  //is zoomed in
      var canvas = document.getElementById('canvas');
      var rect = canvas.getBoundingClientRect();
      var rowNum = event.clientY - rect.top;
      var colNum = event.clientX - rect.left;
      console.log(rowNum + ', ' + colNum);
      rowNum = (rowNum > 0) ? Math.floor(rowNum / 16) + this.state.zoomedInRowNum : 0;
      colNum = (colNum > 0) ? Math.floor(colNum / 16) + this.state.zoomedInColNum : 0;
      this.setState({
        cursor_rowNum: rowNum,
        cursor_colNum: colNum,
        cursor_lastEditedBy: this.state.canvas_data[this.state.cursor_rowNum * N + this.state.cursor_colNum].lastEditedBy,
        cursor_lastEditedAt: this.state.canvas_data[this.state.cursor_rowNum * N + this.state.cursor_colNum].lastEditedAt,
      }); 
    }

  }

  dragStart (event) {
    console.log(event);
  }

  mouseEnterLeaveHandler (action) {
    if (action) {
      this.setState({
        mouseOnCanvas: true
      });
    } else {
      this.setState({
        mouseOnCanvas: false
      });
    }
  }
  //, onDrop, onDragOver, and onDragEnd={this.dragHandler}

  render() {
    return (
      <div className={styles.canvas_interface}>
        <div className={styles.canvas_container} onMouseEnter={() => this.mouseEnterLeaveHandler(true)} onMouseLeave={() => this.mouseEnterLeaveHandler(false)}>
          <canvas className={styles.canvas} id="canvas" width={N} height={N}
                  onWheel={this.zoomHandler} onClick={this.clickHandler} onPointerMove={this.hoverHandler}
                  draggable="true" onDragStart={this.dragStart}>
            <p>Please update to a browser that supports canvas.</p>
          </canvas>
        </div>
        {this.state.mouseOnCanvas &&
          <div className={styles.edit_info}>
            <p>Last Edited By: {this.state.cursor_lastEditedBy}<br />
            Last Edited At: {moment(this.state.cursor_lastEditedAt).format('MMMM Do YYYY, h:mm:ss A')}</p>
          </div>
        }
        {this.state.mouseOnCanvas &&
          <div className={styles.coordinates}>
            <p>({this.state.cursor_rowNum},{this.state.cursor_colNum})</p>
          </div>
        }
      </div>
    );
  }
}

export default CanvasInterface;