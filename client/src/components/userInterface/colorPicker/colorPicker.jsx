import React from 'react';
import { BlockPicker } from 'react-color';
import styles from "./colorPicker.css";

class ColorPicker extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      background: ''
    }
    this.handleChangeComplete = this.handleChangeComplete.bind(this);
  }
  
  componentDidMount () {
    this.setState({
      background: this.props.color
    });
  }

  handleChangeComplete (color) {
    this.setState({
      background: color.hex
    });
    this.props.changeColor(color.hex);
  };

  render() {
    return (
      <div>
        <BlockPicker
          triangle={ 'hide' }
          width={ '220px' }
          colors={["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3",
                   "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39",
                  "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b",
                  "#FAFAFA", "#CCCCCC", "#999999", "#666666", "#333333", "#000000"]}
          color={ this.state.background }
          onChangeComplete={ this.handleChangeComplete }
          background={ "#555500" }
        />
      </div>
    );
  }
}

export default ColorPicker;