import React from 'react';
import styles from "./pixelCanvas.css";

import CanvasInterface from "./canvas/canvasInterface.jsx";
// import UserInterface from "./userInterface/userInterface.jsx";
// const server_url = 'http://localhost:3000/';

class PixelCanvas extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      canvas_data: [],
      user: '',
      color: '',
    }
  }

  componentDidMount () {
  }

  render () {
    return (
      <div className={styles.pixel_canvas}>
        <div className={styles.container}>
          <div className={styles.user_interface}>
            {/* <UserInterface user={this.state.user} color={this.state.color}/> */}
            <h1 className={styles.header}>Pixel Canvas</h1>
            <p className={styles.description_text}>Pick a pixel. Place a pixel. Defend your pixel. Do not fight over pixels.</p>
          </div>
          <div className={styles.canvas}>
            <CanvasInterface data={this.state.canvas_data}/>
          </div>
        </div>
      </div>
    );
  }
}


export default PixelCanvas;