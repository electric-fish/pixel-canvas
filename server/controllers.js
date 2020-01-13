const models = require('./models.js');

const controllers = {

  getCanvas: (req, res) => {

    models.getCanvas()
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });

  },

  postPixel: (req, res) => {
    // console.log(req.body);
    models.postPixel(req.body)
      .then(() => {
        res.status(200);
      })
      .catch((err) => {
        console.log(err);
        res.status(400);
      });
  },

};

module.exports = controllers;