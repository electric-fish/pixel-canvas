const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const db_url = 'mongodb://localhost:27017';
const db_name = 'pixelcanvas';
const collection_name = 'canvas'

const client = new MongoClient(db_url);

client.connect( (err) => {
  assert.equal(null, err);
  console.log("Connected successfully to MongoDB.");
  const db = client.db(db_name);
  const collection = db.collection(collection_name);

  var pixelData = {
    rowNum: 0,
    colNum: 0,
    RGBA_channels: [250, 250, 250, 255],
    // R_channel: 250,
    // G_channel: 250,
    // B_channel: 250,
    // A_channel: 255,
    lastEditedBy: 'admin',
    lastEditedAt: new Date(),
  };
  
  db.collection(collection_name).updateOne({rowNum: pixelData.rowNum, colNum: pixelData.colNum}, pixelData, {upsert: true}, function(err, result) {
    // db.close();
  });

  client.close();
});