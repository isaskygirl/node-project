var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/register.html', function(req, res, next) {
  res.render('register');
});
router.get('/login.html', function(req, res, next) {
  res.render('login');
});
router.get('/userManage.html', function(req, res, next) {
  res.render('userManage');
});
router.get('/phoneManage.html', function(req, res, next) {
  res.render('phoneManage');
});
router.get('/brandManage.html', function(req, res, next) {
  res.render('brandManage');
});
module.exports = router;
