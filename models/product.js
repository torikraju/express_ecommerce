const { ObjectId } = require('mongodb');
const { getDb } = require('../util/database');

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = new ObjectId(id);
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db.collection('products')
        .updateOne(
          { _id: this._id },
          { $set: this }
        );
    }
    else {
      dbOp = db.collection('products')
        .insertOne(this);
    }
    return dbOp;
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => products)
      .catch(err => console.log(err));
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection('products')
      .find({ _id: new ObjectId(prodId) })
      .next()
      .then(product => product)
      .catch(err => console.log(err));
  }
}

module.exports = Product;
