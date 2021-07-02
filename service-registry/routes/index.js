var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('22222222222222222');
  res.render('index', { title: 'Express' });
});

module.exports = router;
