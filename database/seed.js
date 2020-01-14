const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const cliProgress = require('cli-progress');
const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');

const db_url = 'mongodb://localhost:27017';
const db_name = 'pixelcanvas';
const collection_name = 'canvases'
const N = 100;

const client = new MongoClient(db_url, { useUnifiedTopology: true });

client.connect((err) => {
  assert.equal(null, err);
  console.log("Connected successfully to MongoDB.");
  const db = client.db(db_name);
  const collection = db.collection(collection_name);

  var jpegData = fs.readFileSync(path.resolve(__dirname, './1.jpg'));
  var rawImageData = jpeg.decode(jpegData, true); // return as Uint8Array
  // console.log(rawImageData.data);

  var canvasData = [];
  var generateCanvas = () => {
    for (var i = 0; i < 100; i++) {
      for (var j = 0; j < 100; j++) {
        var pixelData = {
          rowNum: i,
          colNum: j,
          RGBA_channels: [rawImageData.data[(i * N + j) * 4], rawImageData.data[(i * N + j) * 4 + 1], rawImageData.data[(i * N + j) * 4 + 2], rawImageData.data[(i * N + j) * 4] + 2],
          lastEditedBy: 'admin',
          lastEditedAt: new Date(),
        }
        // console.log(pixelData);
        canvasData.push(pixelData);
      }
    }
  }
  generateCanvas();
  var totalData = {
    _id: 0,
    data: canvasData
  }
  // console.log(totalData);

  db.collection(collection_name).updateOne({ _id: 0 }, { $set: totalData }, { upsert: true })
    .then(() => {

      jpegData = fs.readFileSync(path.resolve(__dirname, './2.jpg'));
      rawImageData = jpeg.decode(jpegData, true);
      canvasData = [];
      generateCanvas();
      totalData = {
        _id: 1,
        data: canvasData,
      }

      return db.collection(collection_name).updateOne({ _id: 1 }, { $set: totalData }, { upsert: true });
    })
    .then(() => {
      console.log('Seeding part A complete.');

      jpegData = fs.readFileSync(path.resolve(__dirname, './1.jpg'));
      rawImageData = jpeg.decode(jpegData, true);
      canvasData = [];
      generateCanvas();
    
      const importBar = new cliProgress.SingleBar({format: '{bar} {percentage}% | Duration: {duration_formatted} | {value}/{total}'}, cliProgress.Presets.shades_classic);
      importBar.start(200, 0);
      var currentRow = 0;
    
      console.log("\n");  
      canvasData.reduce((accumulator, item, index) => {
    
        return accumulator.then(() => {
          return db.collection('canvas').updateOne({rowNum: item.rowNum, colNum: item.colNum}, {$set: item}, {upsert: true});
        }).then(() => {
          if (item.rowNum !== currentRow) {
            importBar.increment(1);
            currentRow = item.rowNum;
          }
        }).catch((err) => {
          console.error(err);
        });
    
      }, Promise.resolve()).then(() => {
    
        importBar.stop();
        console.log('Seeding part B complete.');
    
        db.collection('canvas').createIndex({ rowNum: 1 })
        .then(() => {
          console.log('Index thing complete.')
          client.close();
        });
    
      });


    });



  // db.collection(collection_name).updateOne({ _id: 0 }, { $set: totalData }, { upsert: true })
  //   .then(() => {
  //     console.log('First canvas inserted.');

  //     jpegData = fs.readFileSync(path.resolve(__dirname, './2.jpg'));
  //     rawImageData = jpeg.decode(jpegData, true);
  //     canvasData = [];
  //     generateCanvas();
  //     totalData = {
  //       _id: 1,
  //       data: canvasData,
  //     }
  //     canvas1.createdAt = totalData.createdAt;

  //     return db.collection(collection_name).updateOne({ _id: 1 }, { $set: totalData }, { upsert: true });
  //   })
  //   .then(() => {

  //     console.log('Second canvas inserted.');
  //     return db.collection('canvas_list').updateOne({ _id: 0}, { $set: canvas0 }, { upsert: true } );

  //   }).then(() => {

  //     console.log('Seeding complete.');

  //   });





  

  /* 

  //------ SINGLE INSERT -----//

  var canvasData = [];
  var generateCanvas = () => {
    for (var i = 0; i < 100; i++) {
      for (var j = 0; j < 100; j++) {
        var pixelData = {
          rowNum: i,
          colNum: j,
          // RGBA_channels: [250, 250, 250, 255],
          RGBA_channels: [rawImageData.data[(i * N + j) * 4], rawImageData.data[(i * N + j) * 4 + 1], rawImageData.data[(i * N + j) * 4 + 2], rawImageData.data[(i * N + j) * 4] + 2],
          lastEditedBy: 'admin',
          lastEditedAt: new Date(),
        }
        // console.log(pixelData);
        canvasData.push(pixelData);
      }
    }
  }
  generateCanvas();
  var totalData = {
    _id: 0,
    data: canvasData
  }

  const importBar = new cliProgress.SingleBar({format: '{bar} {percentage}% | Duration: {duration_formatted} | {value}/{total}'}, cliProgress.Presets.shades_classic);
  importBar.start(200, 0);
  var currentRow = 0;

  console.log("\n");  
  canvasData.reduce((accumulator, item, index) => {

    return accumulator.then(() => {
      return db.collection('canvas').updateOne({rowNum: item.rowNum, colNum: item.colNum}, {$set: item}, {upsert: true});
    }).then(() => {
      if (item.rowNum !== currentRow) {
        importBar.increment(1);
        currentRow = item.rowNum;
      }
    }).catch((err) => {
      console.error(err);
    });

  }, Promise.resolve()).then(() => {

    importBar.stop();
    console.log('Canvas initialization complete.');

    db.collection(collection_name).createIndex({ rowNum: 1 })
    .then(() => {
      console.log('Index thing complete.')
      client.close();
    });

  });

  */

});