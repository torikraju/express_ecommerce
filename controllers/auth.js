const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

const User = require('../models/user');
const { SENDGRID_API_KEYS } = require('../util/string');
const { SIGN_UP_SUCCESS, NO_REPLAY } = require('../util/emailRelatedStuff');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: { api_key: SENDGRID_API_KEYS }
  })
);

exports.getLogin = (req, res) => {
  let message = req.flash('error');
  message = (message.length > 0) ? message[0] : null;

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422)
      .render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: errors.array()[0].msg
      });
  }
  User.findOne({ email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }
      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid email or password.');
          res.redirect('/login');
        })
        .catch(e => {
          console.log(e);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getSignup = (req, res) => {
  let message = req.flash('error');
  message = (message.length > 0) ? message[0] : null;
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  });
};

exports.postSignup = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422)
      .render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: errors.array()[0].msg,
        oldInput: {
          email,
          password,
          confirmPassword: req.body.confirmPassword
        },
        validationErrors: errors.array()
      });
  }
  bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email,
        password: hashedPassword,
        cart: { items: [] }
      });
      user.save()
        .then(() => transporter.sendMail({
          to: email,
          from: NO_REPLAY,
          subject: 'Signup succeeded!',
          html: SIGN_UP_SUCCESS
        }))
        .then(() => res.redirect('/'))
        .catch(e => console.log(e));
    })
    .catch(err => console.log(err));
};

exports.getReset = (req, res) => {
  let message = req.flash('error');
  message = (message.length > 0) ? message[0] : null;
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};

exports.postReset = (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(() => transporter.sendMail({
        to: req.body.email,
        from: NO_REPLAY,
        subject: 'Password reset',
        html: `<p>You requested a password reset</p><p>Click this <a href="http://localhost:3001/reset/${token}">link</a> to set a new password.</p>`
      }))
      .then(() => res.redirect('/'))
      .catch(e => console.log(e));
  });
};

exports.getNewPassword = (req, res) => {
  const { token } = req.params;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() }
  })
    .then(user => {
      let message = req.flash('error');
      message = (message.length > 0) ? message[0] : null;
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => console.log(err));
};

exports.postNewPassword = (req, res) => {
  const { newPassword, userId, passwordToken } = req.body;
  let resetUser;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(() => res.redirect('/login'))
    .catch(e => console.log(e));
};
