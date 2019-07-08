const mongodb = require('mongodb');

const { MongoClient } = mongodb;

let _db;

const _dbUrl = 'mongodb+srv://torikraju:fKZPEn8Nuak4JFd@cluster0-shyre.mongodb.net/express_ecommerce?retryWrites=true&w=majority';

const mongoConnect = (callBack) => {
  MongoClient.connect(_dbUrl, { useNewUrlParser: true })
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
