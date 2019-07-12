const express = require('express');
const { body } = require('express-validator');

const router = express.Router();
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');


router.get('/add-product', isAuth, adminController.getAddProduct);

router.get('/products', isAuth, adminController.getProducts);

router.post('/add-product', [
  body('title')
    .isString()
    .isLength({ min: 3 })
    .trim(),
  body('price')
    .isFloat(),
  body('description')
    .isLength({
      min: 5,
      max: 400
    })
    .trim()
], isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', [
  body('title')
    .isString()
    .isLength({ min: 3 })
    .trim(),
  body('price')
    .isFloat(),
  body('description')
    .isLength({
      min: 5,
      max: 400
    })
    .trim()
], adminController.postEditProduct);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;
