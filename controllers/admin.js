const { validationResult } = require('express-validator');
const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.postAddProduct = (req, res) => {
  const {
    title, imageUrl, price, description
  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422)
      .render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/edit-product',
        editing: false,
        hasError: true,
        product: {
          title,
          imageUrl,
          price,
          description
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array()
      });
  }

  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user
  });
  product
    .save()
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.log(err));
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query['edit'];
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res) => {
  const prodId = req.body.productId;
  const {
    title, price, imageUrl, description
  } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422)
      .render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: true,
        hasError: true,
        product: {
          title,
          imageUrl,
          price,
          description,
          _id: prodId
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array()
      });
  }

  Product.findOneAndUpdate({
    userId: req.user._id,
    _id: req.body.productId
  }, {
    $set: {
      title,
      price,
      imageUrl,
      description
    }
  }, { new: true })
    .then(() => res.redirect('/admin/products'))
    .catch(e => console.log(e));
};

exports.getProducts = (req, res) => {
  Product.find({ userId: req.user._id })
  // .select('title price -_id')
  // .populate('userId', 'name')
    .then(products => res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    }))
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res) => {
  Product.deleteOne({
    _id: req.body.productId,
    userId: req.user._id
  })
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.log(err));
};
