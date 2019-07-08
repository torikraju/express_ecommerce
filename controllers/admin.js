const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res) => {
  const {
    title, imageUrl, price, description
  } = req.body;
  const product = new Product(title, price, description, imageUrl);
  product
    .save()
    .then(() => res.redirect('/admin/products'))
    .catch(e => console.log(e));
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params['productId'];
  Product.findById(prodId)
    .then(products => {
      const product = products;
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product
      });
    })
    .catch(e => console.log(e));
};

exports.postEditProduct = (req, res) => {
  const {
    title, price, imageUrl, description
  } = req.body;
  const product = new Product(title, price, description, imageUrl, req.body['productId']);
  product.save()
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res) => {
  Product.fetchAll()
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
