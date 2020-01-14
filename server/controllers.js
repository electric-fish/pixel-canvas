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

  getCanvasWithId: (req, res) => {

    let canvasId = req.params.canvasId;
    models.getCanvasWithId(canvasId)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });

  },

  getCanvasList: (req, res) => {

    models.getCanvasList()
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

  postPixelWithId: (req, res) => {
    // console.log(req.body);
    let canvasId = req.params.canvasId;
    models.postPixelWithId(req.body, canvasId)
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