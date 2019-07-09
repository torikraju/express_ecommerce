const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res) => {
  const product = new Product(req.body);
  product.save()
    .then(() => res.redirect('/admin/products'))
    .catch(e => console.log(e));
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  Product.findById(req.params['productId'])
    .then(product => {
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product
      });
    })
    .catch(e => {
      res.redirect('/');
      console.log(e);
    });
};

exports.postEditProduct = (req, res) => {
  Product.findByIdAndUpdate(req.body['productId'], req.body, { new: true })
    .then(() => res.redirect('/admin/products'))
    .catch(e => console.log(e));
};

exports.getProducts = (req, res) => {
  Product.find()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res) => {
  Product.deleteById(req.body['productId'])
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
