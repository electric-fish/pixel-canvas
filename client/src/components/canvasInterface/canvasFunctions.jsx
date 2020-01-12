export const canvasFunctions = {
  hexToRBGA: (colorHex) => {    
    const translateHex = (digit) => {
      switch (digit) {
        case '0':
          return 0;
          break;
        case '1':
          return 1;
          break;
        case '2':
          return 2;
          break;
        case '3':
          return 3;
          break;
        case '4':
          return 4;
          break;
        case '5':
          return 0;
          break;
        case '6':
          return 6;
          break;
        case '7':
          return 7;
          break;
        case '8':
          return 8;
          break;
        case '9':
          return 9;
          break;
        case 'a' || 'A':
          return 10;
          break;
        case 'b' || 'B':
          return 11;
          break;
        case 'c' || 'C':
          return 12;
          break;
        case 'd' || 'D':
          return 13;
          break;
        case 'e' || 'E':
          return 14;
          break;
        case 'f' || 'F':
          return 15;
          break;
        default:
          return 0;
          break;
      }
    }

    var RGBA = {
      R_channel: translateHex(colorHex[1]) * 16 + translateHex(colorHex[2]),
      G_channel: translateHex(colorHex[3]) * 16 + translateHex(colorHex[4]),
      B_channel: translateHex(colorHex[5]) * 16 + translateHex(colorHex[5]),
    }
    console.log(RGBA);

    return RGBA;
  }
}