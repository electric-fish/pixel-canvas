const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const db_url = 'mongodb://localhost:27017';
const db_name = 'pixelcanvas';

const client = new MongoClient(db_url);

client.connect( (err) => {
  assert.equal(null, err);
  console.log("Connected successfully to MongoDB.");
  const db = client.db(db_name);
  client.close();
});