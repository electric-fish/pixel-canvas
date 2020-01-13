const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const cliProgress = require('cli-progress');

const db_url = 'mongodb://localhost:27017';
const db_name = 'pixelcanvas';
const collection_name = 'canvas'

const client = new MongoClient(db_url, { useUnifiedTopology: true });

client.connect( (err) => {
  assert.equal(null, err);
  console.log("Connected successfully to MongoDB.");
  const db = client.db(db_name);
  const collection = db.collection(collection_name);


  var canvasData = [];
  var generateCanvas = () => {
    for (var i = 0; i < 100; i++) {
      for (var j = 0; j < 100; j++) {
        var pixelData = {
          rowNum: i,
          colNum: j,
          RGBA_channels: [250, 250, 250, 255],
          lastEditedBy: 'admin',
          lastEditedAt: new Date(),
        }
        canvasData.push(pixelData);
      }
    }
  }
  generateCanvas();

  
  const importBar = new cliProgress.SingleBar({format: '{bar} {percentage}% | Duration: {duration_formatted} | {value}/{total}'}, cliProgress.Presets.shades_classic);
  importBar.start(200, 0);
  var currentRow = 0;

  console.log("\n");  
  canvasData.reduce((accumulator, item, index) => {

    return accumulator.then(() => {
      return db.collection(collection_name).updateOne({rowNum: item.rowNum, colNum: item.colNum}, {$set: item}, {upsert: true});
    }).then(() => {
      if (item.rowNum !== currentRow) {
        importBar.increment(1);
        currentRow = item.rowNum;
      }
    }).catch((err) => {
      console.error(err);
    });
    
  }, Promise.resolve()).then(() => {

    console.log('Canvas initialization complete.');
    client.close();

  });
  

  // var pixelData = {
  //   rowNum: 0,
  //   colNum: 0,
  //   RGBA_channels: [250, 250, 250, 255],
  //   lastEditedBy: 'admin',
  //   lastEditedAt: new Date(),
  // }

  // db.collection(collection_name).updateOne({rowNum: pixelData.rowNum, colNum: pixelData.colNum}, {$set: pixelData}, {upsert: true})
  //   .then(() => {
  //     client.close();
  //   });
  
});