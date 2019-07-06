const Product = require('../models/product');


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

exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body['productId'];
  req.user.getCart()
    .then(cart => cart.getProducts({ where: { id: prodId } }))
    .then(products => {
      const [product] = products;
      return product['cartItem'].destroy();
    })
    .then(() => res.redirect('/cart'))
    .catch(e => console.log(e));
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
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

exports.getOrders = (req, res) => {
  req.user
    .getOrders({ include: ['products'] })
    .then(orders => res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders
    }))
    .catch(err => console.log(err));
};

exports.postOrder = (req, res) => {
  let cart;
  let products;
  req.user.getCart()
    .then(_cart => {
      cart = _cart;
      return _cart.getProducts();
    })
    .then(_products => {
      products = _products;
      return req.user.createOrder();
    })
    .then(order => {
      order.addProducts(products.map(product => {
        product.orderItem = { quantity: product['cartItem'].quantity };
        return product;
      }));
    })
    .then(() => cart.setProducts(null))
    .then(() => res.redirect('/orders'))
    .catch(e => console.log(e));
};
