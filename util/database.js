const mongodb = require('mongodb');

const { MongoClient } = mongodb;

let _db;

const mongoConnect = (callBack) => {
  MongoClient.connect('mongodb+srv://torikraju:fKZPEn8Nuak4JFd@cluster0-shyre.mongodb.net/test?retryWrites=true&w=majority')
    .then(client => {
      _db = client.db();
      callBack(client);
    })
    .catch(e => {
      console.log(e);
      throw e;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
};


exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
