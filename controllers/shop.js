const Product = require('../models/product');
const Cart = require('../models/cart');


exports.getProducts = (req, res, next) => {
  Product.findAll()
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
  Product.findAll()
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
  req.user.getCart()
    .then(cart => cart.getProducts())
    .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products
      });
    })
    .catch(e => console.log(e));
};

exports.postCart = (req, res) => {
  const prodId = req.body['productId'];
  let product;
  let cart;
  let newQty = 1;
  req.user.getCart()
    .then(_cart => {
      cart = _cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      if (products.length > 0) {
        [product] = products;
      }
      if (product) {
        const oldQty = product['cartItem'].quantity;
        newQty = oldQty + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(_product => cart.addProduct(_product, { through: { quantity: newQty } }))
    .then(() => res.redirect('/cart'))
    .catch(e => console.log(e));

};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body['productId'];
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
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

exports.getProduct = (req, res) => {
  Product.findByPk(req.params['productId'])
    .then(product => {
      res.render('shop/product-detail', {
        product,
        path: '/products',
        pageTitle: product.title
      });
    })
    .catch(e => console.log(e));
};
