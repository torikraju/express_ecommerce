const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const { DB_URL } = require('./util/string');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error');

// const User = require('./models/user');


const app = express();
const port = 3001;

app.set('view engine', 'ejs');
app.set('views', 'views');


// for form body
app.use(bodyParser.urlencoded({ extended: false }));
// for serving static file
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  // User.findById('5d23245eb9bdf42f457370df')
  //   .then(user => {
  //     req.user = new User(user.name, user.email, user.cart, user._id);
  //     next();
  //   })
  //   .catch(err => console.log(err));
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// catch 404 error
app.use(errorController.get404);

mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => app.listen(port, () => console.log(`Example app listening on port ${port}!`)))
  .catch(e => console.log(e));
