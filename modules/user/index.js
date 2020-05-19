var express = require('express');
var router = express.Router();
var userController = require('./user.controller');

router.post('/register', userController.register);
router.get('/verify-user', userController.verifyUser);

module.exports = router;