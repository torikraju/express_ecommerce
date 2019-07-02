const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();
const port = 3001;

app.set('view engine', 'ejs');
app.set('views', 'views');

//for form body
app.use(bodyParser.urlencoded({extended: false}));
//for serving static file
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.router);
app.use(shopRoutes);

//catch 404 error
app.use((req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'Page not found',
        path: '/'
    });
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));