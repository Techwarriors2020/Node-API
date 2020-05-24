var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: Number,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: new Date()
    },
    isVerified: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('user', userSchema);