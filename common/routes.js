var express = require('express');
var bodyParser = require('body-parser');

var router = express.Router();
router.use(bodyParser.json());
router.use('/user', require('../modules/user'));
router.use('/carousel', require('../modules/carousel'));

module.exports = router;