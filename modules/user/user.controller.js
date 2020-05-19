var UserService = require('./user.service');
exports.register = function(req, res) {
    var data = req.body;
    UserService.registerUser(data)
    .on('SUCCESS', function(){
        res.send({
            message: 'Registered successfully.',
            email: data.email
        });
    })
    .on('DUPLICATE', function(){
        res.send({message: 'User allready exist.'});
    })
    .on('INVALID_EMAIL', function(){
        res.send({message: 'Entered email is invalid.'});
    })
    .on('ERROR', function(){
        res.send({message: 'Error while registering user'});
    })
    .on('INCOMPLETE_DATA', function(){
        res.send({message: 'Please enter complete data of user.'});
    })
    .on('PASSWORD_MISMATCH', function(){
        res.send({message: 'Password and confirm password are not matching.'});
    })
};

exports.verifyUser = function(req, res){
    var data = req.query;
    UserService.verifyUser(data)
    .on('SUCCESS', function(){
        res.send('Account verified successfully');
    })
    .on('ERROR', function(error){
        res.send({message:'Un-authorized', details:error});
    })
    .on('EXPIRED', function(){
        res.send('Verification expired.');
    })
}