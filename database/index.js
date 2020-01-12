const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const db_url = 'mongodb://localhost:27017/';



var pixelData = {
  R_channel: 50,
  G_channel: 50,
  B_channel: 50,
  lastEditedBy: 'Example',
  lastEditedAt: new Timestamp(),
};










MongoClient.connect(db_url, function (err, client) {
  assert.equal(null, err);



  // client.close();
});