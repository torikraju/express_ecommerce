const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');

const { MONGODB_URI } = require('./util/string');


const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');


// for form body
app.use(bodyParser.urlencoded({ extended: false }));
// for serving static file
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store
  })
);

// app.use((req, res, next) => {
//   User.findById('5d242c39606f226cd1e3007d')
//     .then(user => {
//       req.user = user;
//       next();
//     })
//     .catch(err => console.log(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// catch 404 error
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => User.findOne())
  .then(user => {
    if (!user) {
      const _user = new User({
        name: 'torikul',
        email: 'torikraju@gmail.com',
        cart: {
          items: []
        }
      });
      return _user.save();
    }
  })
  .then(() => app.listen(3001, () => console.log(`Example app listening on port ${3001}!`)))
  .catch(e => console.log(e));
