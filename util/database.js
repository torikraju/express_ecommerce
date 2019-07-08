const mongodb = require('mongodb');

const { MongoClient } = mongodb;

const mongoConnect = (callBack) => {
  MongoClient.connect('mongodb+srv://torikraju:fKZPEn8Nuak4JFd@cluster0-shyre.mongodb.net/test?retryWrites=true&w=majority')
    .then(client => callBack(client))
    .catch(e => console.log(e));
};

module.exports = mongoConnect;
