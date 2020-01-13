const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser')
var controllers = require('./controllers.js');

const app = express();

app.set('port', 3000);
app.use(cors());

app.use('/', express.static(path.join(__dirname, '../client/dist')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/canvas', (req, res) => {
  controllers.getCanvas(req, res);
});

app.post('/api/canvas', (req, res) => {
  controllers.postPixel(req, res);
});

if (!module.parent) {
  app.listen(app.get('port'));
  console.log('Listening on:', app.get('port'));
}