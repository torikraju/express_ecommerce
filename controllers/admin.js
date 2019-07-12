const { validationResult } = require('express-validator');

const Product = require('../models/product');
const { deleteFile } = require('../util/AppUtil');


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

exports.postAddProduct = (req, res, next) => {
  const {
    title, price, description
  } = req.body;
  const image = req.file;

  if (!image) {
    return res.status(422)
      .render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/edit-product',
        editing: false,
        hasError: true,
        product: {
          title,
          price,
          description
        },
        errorMessage: 'Attached file is not an image',
        validationErrors: []
      });
  }

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
          price,
          description
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array()
      });
  }

  const imageUrl = `/${image.path}`;

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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const {
    title, price, description
  } = req.body;
  const image = req.file;

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
          price,
          description,
          _id: prodId
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array()
      });
  }

  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = title;
      product.price = price;
      product.description = description;
      let file;
      if (image) {
        file = product.imageUrl;
        product.imageUrl = `/${image.path}`;
      }
      return product.save()
        .then(() => {
          if (file) deleteFile(file);
          res.redirect('/admin/products');
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
  // .select('title price -_id')
  // .populate('userId', 'name')
    .then(products => res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    }))
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  Product.findOne({
    _id: req.body.productId,
    userId: req.user._id
  })
    .then(product => product.remove())
    .then(() => res.redirect('/admin/products'))
    .catch(e => {
      const error = new Error(e);
      error.httpStatusCode = 500;
      return next(error);
    });
};
