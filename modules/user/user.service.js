var EventEmitter = require('events');
var config = require('../../config/environment');
var mailer = require('../../common/mailer');
var secretKey = "emart_jwt_token";
var jwt = require('jsonwebtoken');

exports.registerUser = function (data) {
    var emitter = new EventEmitter();
    if (data && data.email && data.password && data.confirmPassword && data.mobileNumber) {
        if(data.password === data.confirmPassword) {
            if (validateEmail(data.email)) {
                var token = jwt.sign({ email: data.email }, secretKey, { expiresIn: 60 * 60 });
                let linkToVerifyUser = `${config.apiUrl}/user/verify-user?token=${token}&email=${data.email}`;
                mailer.sendMail(data.email, linkToVerifyUser)
                .on('DONE', function () {
                    emitter.emit('SUCCESS');
                })
                .on('ERROR', () => {
                    emitter.emit('ERROR');
                });
            } else {
                setTimeout(function () {
                    emitter.emit('INVALID_EMAIL');
                }, 1);
            }
        } else {
            emitter.emit('PASSWORD_MISMATCH');
        }
    } else {
        setTimeout(function () {
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
            emitter.emit('SUCCESS');
        }
    });

    return emitter;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}