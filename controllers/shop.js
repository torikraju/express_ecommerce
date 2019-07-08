const Product = require('../models/product');
const Cart = require('../models/cart');


exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(e => console.log(e));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(e => console.log(e));
};

exports.getCart = (req, res, next) => {
  // Cart.getCart((cart) => {
  //   Product.fetchAll((products) => {
  //     const cartProduct = [];
  //     products.map((product) => {
  //       const catProductData = cart.products.find(prod => prod.id === product.id);
  //       if (catProductData) {
  //         cartProduct.push({
  //           productData: product,
  //           qty: catProductData.qty
  //         });
  //       }
  //       res.render('shop/cart', {
  //         path: '/cart',
  //         pageTitle: 'Your Cart',
  //         products: cartProduct
  //       });
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  // const prodId = req.body['productId'];
  // Product.findById(prodId, (product) => {
  //   Cart.addProduct(prodId, product.price);
  // });
  // console.log(prodId);
  // res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
  // const prodId = req.body['productId'];
  // Product.findById(prodId, (product) => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect('/cart');
  // });
};


exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};


exports.getProduct = (req, res, next) => {
  Product.findById(req.params['productId'])
    .then(product => {
      res.render('shop/product-detail', {
        product,
        path: '/products',
        pageTitle: product.title
      });
    })
    .catch(e => console.log(e));
};
