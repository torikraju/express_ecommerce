const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const sequelize = require('./util/database');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();
const port = 3001;

app.set('view engine', 'ejs');
app.set('views', 'views');


// for form body
app.use(bodyParser.urlencoded({ extended: false }));
// for serving static file
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes.router);
app.use(shopRoutes);

// catch 404 error
app.use(errorController.get404);

// relationship definition
Product.belongsTo(User, {
  constraints: true,
  onDelete: 'CASCADE'
});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

// crates tables for us
sequelize.sync({ force: false })
  .then(() => User.findByPk(1))
  .then(user => {
    if (!user) {
      // crate a user  dummy
      return User.create({
        name: 'torikul alam',
        email: 'torikraju@gmail.com'
      });
    }
    return Promise.resolve(user);
  })
  .then(user => user.createCart())
  .then(() => app.listen(port, () => console.log(`Example app listening on port ${port}!`)))
  .catch(e => console.log(e));
