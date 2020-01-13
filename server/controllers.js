const models = require('./models.js');

const controllers = {

  getCanvas: (req, res) => {

    models.getCanvas()
      .then( (result) => {
        res.status(200).send(result);
      })
      .catch( (err) => {
        console.log(err);
        res.status(400).send(err);
      });

  },

  putPixel: (req, res) => {

  },
  
};

module.exports = controllers;