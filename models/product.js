const mongoose = require('mongoose');

const { Schema } = mongoose;

const User = require('./user');
const { deleteFile } = require('../util/AppUtil');


const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

productSchema.post('remove', product => {
  console.log(product);
  User.update(
    {},
    { $pull: { 'cart.items': { productId: product._id } } },
    { multi: true }
  )
    .then(() => deleteFile(product['imageUrl']))
    .catch(e => console.log(e));
});

module.exports = mongoose.model('Product', productSchema);
