var express = require('express');
var router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn')


/* GET home page. */
router.get('/', isLoggedIn ,function(req, res, next) {
  res.render('index', { student: req.student });
});

module.exports = router;
