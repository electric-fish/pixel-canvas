const client = require('../database/index.js');

const db_url = 'mongodb://localhost:27017';
const db_name = 'pixelcanvas';
const collection_name = 'canvas'

const models = {

  getCanvas: () => {

    return new Promise((resolve, reject) => {
      const db = client.db(db_name);
      const collection = db.collection(collection_name);
  
      db.collection(collection_name).find({}).toArray()
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.log(err);
        });
      
    });

  }

};

module.exports = models;