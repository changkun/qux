
const mongo = require('mongodb');

module.exports = new mongo.Db(
  'qux',
  new mongo.Server('localhost', 27017),
  { safe: true }
);