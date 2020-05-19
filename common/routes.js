var express = require('express');
var bodyParser = require('body-parser');

var router = express.Router();
router.use(bodyParser.json());
router.use('/user', require('../modules/user'));

module.exports = router;