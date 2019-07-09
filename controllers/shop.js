const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res) => {
  Product.findById(req.params['productId'])
    .then(product => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: user.cart.items
    }))
    .catch(err => console.log(err));
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => req.user.addToCart(product))
    .then(() => res.redirect('/cart'))
    .catch(e => console.log(e));
};

exports.postCartDeleteProduct = (req, res) => {
  req.user
    .removeFromCart(req.body.productId)
    .then(() => res.redirect('/cart'))
    .catch(e => console.log(e));
};

exports.postOrder = (req, res) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: user.cart.items.map(item => ({
          quantity: item.quantity,
          product: { ...item.productId._doc }
        }))
      });
      order.save()
        .then(() => {
          req.user.clearCart();
          res.redirect('/orders');
        })
        .catch(e => console.log(e));
    });
};

exports.getOrders = (req, res) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      const _orders = orders.map(order => {
        let totalPrice = 0;
        order.products.map(p => {
          totalPrice += p.product.price * p.quantity;
        });
        return (
          {
            ...order,
            totalPrice: totalPrice.toFixed(2)
          }
        );
      });
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: _orders
      });
    })
    .catch(e => console.log(e));
};
