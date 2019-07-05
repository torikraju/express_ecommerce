const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const {
    title, imageUrl, price, description
  } = req.body;
  Product.create({
    title,
    price,
    description,
    imageUrl
  })
    .then(r => console.log(r))
    .catch(e => console.log(e));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query['edit'];
  const prodId = req.params['productId'];
  Product.findById(prodId, (product) => {
    if (!product) {
      return res.redirect('/');
    }
    return res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const {
    id, title, imageUrl, price, description
  } = req.body;
  const product = new Product(id, title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body['id'];
  Product.deleteById(prodId);
  res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fielddData]) => {
      res.render('admin/products', {
        prods: rows,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(e => console.log(e));
};
