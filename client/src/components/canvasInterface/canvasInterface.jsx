import React from 'react';
import styles from "./canvasInterface.css";
import moment from 'moment';
// import { useDrag } from 'react-use-gesture';

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
      dragging: false,
      dragStartPos: [0, 0],
    }
    this.getCanvas = this.getCanvas.bind(this);
    this.updateCanvas = this.updateCanvas.bind(this);
    this.zoomHandler = this.zoomHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.hoverHandler = this.hoverHandler.bind(this);
    this.dragStart = this.dragStart.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
    this.mouseEnterLeaveHandler = this.mouseEnterLeaveHandler.bind(this);
  }

  getCanvas() {

    if (this.props.currCanvas === 0 || this.props.currCanvas === '0') {
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
            this.setState({
              canvas_data: result
            });
            resolve();
          });
      });
    } else {
      
      return new Promise((resolve, reject) => {
        fetch(server_url + '/api/canvasWithId/' + this.props.currCanvas, {
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
            this.setState({
              canvas_data: result.data
            });
            resolve();
          });
      });

    }

  }

  updateCanvas() {
    this.getCanvas()
      .then(() => {

        if (!this.state.zoomedIn) { // zoomed out
          var newData = canvasFunctions.rawDataToImageData(this.state.canvas_data);
          var ctx = document.getElementById('canvas').getContext('2d');
          var newImageData = new ImageData(N, N);
          for (var i = 0; i < newData.length; i++) {
            newImageData.data[i] = newData[i];
          }
          ctx.putImageData(newImageData, 0, 0);

        } else { // zoomed in
          var newData = canvasFunctions.rawDataToImageData(this.state.canvas_data);
          var ctx = document.getElementById('canvas').getContext('2d');
          var newImageData = new ImageData(N, N);
          for (var i = 0; i < newData.length; i++) {
            newImageData.data[i] = newData[i];
          }
          ctx.putImageData(newImageData, 0 - this.state.zoomedInColNum, 0 - this.state.zoomedInRowNum);
        }

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
      // console.log('zoom out');
      if (this.state.zoomedIn) {
        this.setState({
          zoomedIn: false,
          zoomedInRowNum: 0,
          zoomedInColNum: 0,
        });
        var canvas = document.getElementById("canvas");
        canvas.width *= 2;
        canvas.height *= 2;
        this.updateCanvas();
      }
    } else { //scroll up
      // console.log('zoom in');
      if (!this.state.zoomedIn) {
        this.setState({
          zoomedIn: true,
          zoomedInRowNum: 25,
          zoomedInColNum: 25,
        });
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext('2d');
        ctx.save();
        var imageData = ctx.getImageData(0, 0, 100, 100);
        // console.log(imageData);
        canvas.width /= 2;
        canvas.height /= 2;
        ctx.putImageData(imageData, -25, -25);
        ctx.restore();
      }
    }
  }

  clickHandler(event) {
    if (!this.state.dragging) {
      const RGBA = canvasFunctions.hexToRGBA(this.props.colorHex);
      console.log(this.props.colorHex);
      console.log(RGBA);
  
      var canvas = document.getElementById('canvas');
      this.props.postPixelHandler(this.state.cursor_rowNum, this.state.cursor_colNum);
      this.updateCanvas();
    }
  }

  hoverHandler () {
    if (!this.state.zoomedIn) { // is zoomed out
      var canvas = document.getElementById('canvas');
      var rect = canvas.getBoundingClientRect();
      var rowNum = event.clientY - rect.top;
      var colNum = event.clientX - rect.left;
      // console.log(rowNum + ', ' + colNum);
      rowNum = (rowNum > 0) ? Math.floor(rowNum / ratio) : 0;
      colNum = (colNum > 0) ? Math.floor(colNum / ratio) : 0;
      if (this.state.canvas_data[this.state.cursor_rowNum * N + this.state.cursor_colNum] !== undefined) {
        this.setState({
          cursor_rowNum: rowNum,
          cursor_colNum: colNum,
          cursor_lastEditedBy: this.state.canvas_data[this.state.cursor_rowNum * N + this.state.cursor_colNum].lastEditedBy || null,
          cursor_lastEditedAt: this.state.canvas_data[this.state.cursor_rowNum * N + this.state.cursor_colNum].lastEditedAt || null,
        }); 
      }
    } else {  // is zoomed in
      var canvas = document.getElementById('canvas');
      var rect = canvas.getBoundingClientRect();
      var rowNum = event.clientY - rect.top;
      var colNum = event.clientX - rect.left;
      // console.log(rowNum + ', ' + colNum);
      rowNum = (rowNum > 0) ? Math.floor(rowNum / 16) + this.state.zoomedInRowNum : 0;
      colNum = (colNum > 0) ? Math.floor(colNum / 16) + this.state.zoomedInColNum : 0;
      if (this.state.canvas_data[this.state.cursor_rowNum * N + this.state.cursor_colNum] !== undefined) {
        this.setState({
          cursor_rowNum: rowNum,
          cursor_colNum: colNum,
          cursor_lastEditedBy: this.state.canvas_data[this.state.cursor_rowNum * N + this.state.cursor_colNum].lastEditedBy || null,
          cursor_lastEditedAt: this.state.canvas_data[this.state.cursor_rowNum * N + this.state.cursor_colNum].lastEditedAt || null,
        }); 
      }
    }

  }

  dragStart (event) {
    console.log('drag start.');
    // console.log(this.state.cursor_rowNum + ',' + this.state.cursor_colNum);
    event.preventDefault();
    this.setState({
      dragging: true,
      dragStartPos: [this.state.cursor_rowNum, this.state.cursor_colNum]
    });
  }

  dragEnd (event) {
    console.log('drag end.');
    // console.log(this.state.cursor_rowNum + ',' + this.state.cursor_colNum);

    var startPos = this.state.dragStartPos;
    var endPos = [this.state.cursor_rowNum, this.state.cursor_colNum];
    var currUpperLeftPos = [this.state.zoomedInRowNum, this.state.zoomedInColNum];

    console.log('start pos: ' + startPos[0] + ',' + startPos[1]);
    console.log('end pos: ' + endPos[0] + ',' + endPos[1]);
    console.log('starting upper left pos: ' + currUpperLeftPos[0] + ',' + currUpperLeftPos[1]);

    console.log(endPos[0] - startPos[0]); // horizontal; positive down, negative up
    currUpperLeftPos[0] += Math.floor((endPos[0] - startPos[0]));
    if (currUpperLeftPos[0] > 50) {
      currUpperLeftPos[0] = 50;
    } else if (currUpperLeftPos[0] <= 0) {
      currUpperLeftPos[0] = 0;
    }

    console.log(endPos[1] - startPos[1]); // horizontal; positive down, negative up
    currUpperLeftPos[1] += Math.floor((endPos[1] - startPos[1]));
    if (currUpperLeftPos[1] > 50) {
      currUpperLeftPos[1] = 50;
    } else if (currUpperLeftPos[1] <= 0) {
      currUpperLeftPos[1] = 0;
    }

    console.log('ending upper left pos: ' + currUpperLeftPos[0] + ',' + currUpperLeftPos[1]);

    this.setState({
      zoomedInRowNum: currUpperLeftPos[0],
      zoomedInColNum: currUpperLeftPos[1]
    });

    // if (startPos[0] >= endPos[0] && startPos[1] >= endPos[1]) { // going upper left
    //   console.log('upper left');
    // } else if (startPos[0] < endPos[0] && startPos[1] >= endPos[1]) { // going lower right
    //   console.log('lower right');
    // } else if (startPos[0] >= endPos[0] && startPos[1] < endPos[1]) { // going upper right
    //   console.log('upper right');
    // } else { // going lower left
    //   console.log('lower left');
    // }


    setTimeout(() => {
      this.setState({
        dragging: false
      });
    }, 200);
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

  render() {
    return (
      <div className={styles.canvas_interface}>
      {/* 
        { this.state.dragging ?

          <div className={styles.canvas_container_drag} onMouseEnter={() => this.mouseEnterLeaveHandler(true)} onMouseLeave={() => this.mouseEnterLeaveHandler(false)}>
            <canvas className={styles.canvas} id="canvas" width={N} height={N}
                    onWheel={this.zoomHandler} onClick={this.clickHandler} onPointerMove={this.hoverHandler}
                    draggable="true" onDragStart={this.dragStart} onMouseUp={this.dragEnd} >
              <p>Please update to a browser that supports canvas.</p>
            </canvas>
          </div>
        :        
          <div className={styles.canvas_container} onMouseEnter={() => this.mouseEnterLeaveHandler(true)} onMouseLeave={() => this.mouseEnterLeaveHandler(false)}>
            <canvas className={styles.canvas} id="canvas" width={N} height={N}
                    onWheel={this.zoomHandler} onClick={this.clickHandler} onPointerMove={this.hoverHandler}
                    draggable="true" onDragStart={this.dragStart} onMouseUp={this.dragEnd} >
              <p>Please update to a browser that supports canvas.</p>
            </canvas>
          </div>

        } */}

        <div className={styles.canvas_container} onMouseEnter={() => this.mouseEnterLeaveHandler(true)} onMouseLeave={() => this.mouseEnterLeaveHandler(false)}>
          <canvas className={styles.canvas} id="canvas" width={N} height={N}
                  onWheel={this.zoomHandler} onClick={this.clickHandler} onPointerMove={this.hoverHandler}
                  draggable="true" onDragStart={this.dragStart} onMouseUp={this.dragEnd} >
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