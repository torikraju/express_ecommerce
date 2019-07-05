const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const sequelize = require('./util/database');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');


const app = express();
const port = 3001;

app.set('view engine', 'ejs');
app.set('views', 'views');


// for form body
app.use(bodyParser.urlencoded({ extended: false }));
// for serving static file
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes.router);
app.use(shopRoutes);

// catch 404 error
app.use(errorController.get404);

// crates tables for us
sequelize.sync()
  .then(() => {
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
  })
  .catch(e => console.log(e));
