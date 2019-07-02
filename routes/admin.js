const express = require('express');

const router = express.Router();

router.get('/add-product', (req, res, next) => {
    res.send('<form action="/save-product" method="post">\n' +
        '  Add Product:<br>\n' +
        '  <input type="text" name="title" >\n' +
        '  <input type="submit" value="Submit">\n' +
        '</form> ');
});

router.post('/save-product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});


module.exports = router;