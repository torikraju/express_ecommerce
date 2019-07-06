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
  req.user.createProduct({
    title,
    price,
    description,
    imageUrl
  })
    .then(() => res.redirect('/admin/products'))
    .catch(e => console.log(e));
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query['edit'];
  if (!editMode) {
    return res.redirect('/');
  }
  req.user.getProducts({ where: { id: req.params['productId'] } })
    .then(products => {
      const product = products[0];
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
    id, title, imageUrl, price, description
  } = req.body;
  Product.findByPk(id)
    .then(product => product.update({
      title,
      imageUrl,
      price,
      description
    }))
    .then(() => res.redirect('/admin/products'))
    .catch(e => console.log(e));
};

exports.postDeleteProduct = (req, res) => {
  Product.destroy({
    where: { id: req.body['id'] }
  })
    .then(() => res.redirect('/admin/products'))
    .catch(e => console.log(e));
};

exports.getProducts = (req, res) => {
  req.user.getProducts()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(e => console.log(e));
};
