const { ObjectId } = require('mongodb');

const getDB = require('../util/database').getDb;

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }


  save() {
    const db = getDB();
    return db.collection('products')
      .insertOne(this)
      .then(result => console.log(result))
      .catch(e => console.log(e));
  }

  static fetchAll() {
    const db = getDB();
    return db.collection('products')
      .find()
      .toArray()
      .then(products => {
        console.log(products);
        return products;
      })
      .catch(e => console.log(e));
  }

  static findById(prodId) {
    console.log(prodId);
    const db = getDB();
    return db.collection('products')
      .find({ _id: ObjectId(prodId) })
      .next()
      .then(product => {
        console.log(`Product: ${product}`);
        return product;
      })
      .catch(e => console.log(e));
  }
}

module.exports = Product;
