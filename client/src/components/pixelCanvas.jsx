import React from 'react';
import styles from "./pixelCanvas.css";

import { canvasFunctions } from "./canvasInterface/canvasFunctions.jsx";
import CanvasInterface from "./canvasInterface/canvasInterface.jsx";
import UserInterface from "./userInterface/userInterface.jsx";
const server_url = 'http://localhost:3000';

class PixelCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canvas_data: [],
      userName: 'unknown-user',
      color: '#607d8b',
    }
    this.changeUserName = this.changeUserName.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.postPixelHandler = this.postPixelHandler.bind(this);
  }

  componentDidMount() {

    fetch(server_url + '/api/canvas', {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })
      .catch((err) => {
        console.error(err);
      })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        console.log(result);
      });

  }

  changeUserName(name) {
    this.setState({
      userName: name
    });
  }

  changeColor(color) {
    this.setState({
      color: color
    });
  }

  postPixelHandler(rowNum, colNum) {
    var pixelData = {
      rowNum: rowNum,
      colNum: colNum,
      RBGA_channels: canvasFunctions.hexToRBGA(this.state.color),
      lastEditedBy: this.state.userName,
      lastEditedAt: new Date()
    }
    console.log(pixelData);

    fetch(server_url + '/api/canvas', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(pixelData)
    })
      .catch((err) => {
        console.error(err);
      })
      .then(() => {
        console.log("POST success (probably).")
      });
  }

  render() {
    return (
      <div className={styles.pixel_canvas}>
        <div className={styles.container}>
          <div className={styles.user_interface}>
            <UserInterface userName={this.state.userName} color={this.state.color} changeUserName={this.changeUserName} changeColor={this.changeColor} />
            <h1 className={styles.header}>Pixel Canvas</h1>
            <p className={styles.description_text}>Pick a pixel. Place a pixel. Defend your pixel. Do (not) fight over pixels.</p>
          </div>
          <div className={styles.canvas}>
            <CanvasInterface data={this.state.canvas_data} colorHex={this.state.color} postPixelHandler={this.postPixelHandler} />
          </div>
        </div>
      </div>
    );
  }
}


export default PixelCanvas;