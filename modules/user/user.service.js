var EventEmitter = require('events');
var config = require('../../config/environment');
var mailer = require('../../common/mailer');
var UserModel = require('./user.model');
var crypto = require('crypto');
var algorithm = "aes-256-ctr";
var secretKey = "tech_warrior";
var jwt = require('jsonwebtoken');

exports.registerUser = function (data) {
    var emitter = new EventEmitter();
    console.log(data);
    if (data && data.email && data.mobileNumber && data.password && data.confirmPassword) {
        if(data.password === data.confirmPassword) {
            if (validateEmail(data.email)) {
                var encrypted = crypto.createCipher(algorithm, data.password);
                data.password = encrypted.update(secretKey, "utf8", "hex");
                data.userId = Date.now();
                var userData = new UserModel(data);
                userData.save().then(function (user) {
                    var token = jwt.sign({ email: data.email }, secretKey, { expiresIn: 60 * 60 });
                    let linkToVerifyUser = `${config.apiUrl}/user/verify-user?token=${token}&email=${data.email}`;
                    mailer.sendMail(data.email, linkToVerifyUser).on('DONE', function () {
                        emitter.emit('SUCCESS');
                    });
                }, function (error) {
                    if (error.code === 11000) {
                        emitter.emit('DUPLICATE');
                    } else {
                        emitter.emit('ERROR');
                    }
                });
            } else {
                setTimeout(() => {
                    emitter.emit('INVALID_EMAIL');
                }, 1);
            }
        } else {
            setTimeout(() => {
                emitter.emit('PASSWORD_MISMATCH');
            }, 1);
        }
    } else {
        setTimeout(() => {
            emitter.emit('INCOMPLETE_DATA');
        }, 1);
    }

    return emitter;
}

exports.verifyUser = function (data) {
    var emitter = new EventEmitter();
    jwt.verify(data.token, secretKey, function(err, token){
        if(err && err.expiredAt) {
            setTimeout(function(){
                emitter.emit('EXPIRED');
            },0);
        } else {
            UserModel.update({email: data.email}, {$set: {isVerified: true}}).then(function(users){
                emitter.emit('SUCCESS');
            }, function(error){
                emitter.emit('ERROR', error);
            });
        }
    });

    return emitter;
}

exports.loginUser = function (data) {
    var emitter = new EventEmitter();
    if (data && data.email && data.password) {
        if (validateEmail(data.email)) {
            var encrypted = crypto.createCipher(algorithm, data.password);
            data.password = encrypted.update(secretKey, "utf8", "hex");
            data.isVerified = true;
            UserModel.find(data, {_id: 0, email: 1, mobileNumber: 1}).then(function (user) {
                if (user.length) {
                    var token = jwt.sign({ email: data.email }, secretKey, { expiresIn: 15 * 60 });
                    setTimeout(() => {
                        emitter.emit('SUCCESS', {token, user});
                    }, 1);
                } else {
                    setTimeout(() => {
                        emitter.emit('USER_NOT_FOUND');
                    }, 1);
                }
            }, function (error) {
                setTimeout(() => {
                    emitter.emit('ERROR');
                }, 1);
            });
        } else {
            setTimeout(function () {
                emitter.emit('INVALID_EMAIL');
            }, 1);
        }

    } else {
        setTimeout(function () {
            emitter.emit('INCOMPLETE_DATA');
        }, 1);
    }

    return emitter;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}