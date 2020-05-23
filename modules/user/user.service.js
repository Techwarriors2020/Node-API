var EventEmitter = require('events');
var config = require('../../config/environment');
var mailer = require('../../common/mailer');
var secretKey = "emart_jwt_token";
var jwt = require('jsonwebtoken');

exports.registerUser = function (data) {
    var emitter = new EventEmitter();
    console.log(data);
    if (data && data.email && data.mobileNumber && data.password && data.confirmPassword) {
        if(data.password === data.confirmPassword) {
            if (validateEmail(data.email)) {
                var token = jwt.sign({ email: data.email }, secretKey, { expiresIn: 60 * 60 });
                let linkToVerifyUser = `${config.apiUrl}/user/verify-user?token=${token}&email=${data.email}`;
                mailer.sendMail(data.email, linkToVerifyUser)
                .on('DONE', function () {
                    setTimeout(() => {
                        emitter.emit('SUCCESS');
                    }, 1);
                })
                .on('ERROR', () => {
                    setTimeout(() => {
                        emitter.emit('ERROR');
                    }, 1);
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
            setTimeout(() => {
                emitter.emit('EXPIRED');
            }, 1);
        } else {
            setTimeout(() => {
                emitter.emit('SUCCESS');
            }, 1);
        }
    });

    return emitter;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}