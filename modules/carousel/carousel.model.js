var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var carouselSchema = new Schema({
    carouselImage: {
        type: String,
        required: true
    },
    carouselItemId: {
        type: Number,
        unique: true,
        required: true
    },
    heading: {
        type: String
    },
    carouselOrder: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    creationDate: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model('carousel', carouselSchema);