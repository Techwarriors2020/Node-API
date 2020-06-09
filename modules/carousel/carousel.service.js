var EventEmitter = require('events');
var CarouselModel = require('./carousel.model');

exports.getCarouselItems = function () {
    var emitter = new EventEmitter();
    CarouselModel.find({}, {__v: 0, _id: 0}).then(function(carouselItems){
        emitter.emit("SUCCESS",carouselItems);
    }, function(error){
        emitter.emit("ERROR", error);
    });

    return emitter;
}

exports.getCarouselItemById = (id) => {
    var emitter = new EventEmitter();
    CarouselModel.find({carouselItemId: id}, {__v: 0, _id: 0}).then(function(carouselItem){
        emitter.emit("SUCCESS",carouselItem);
    }, function(error){
        emitter.emit("ERROR", error);
    });

    return emitter;
}

exports.addCarouselItem = function (data) {
    var emitter = new EventEmitter();
    data.carouselItemId = Date.now();
    var carouselData = new CarouselModel(data);
    carouselData.save().then(function(data){
        emitter.emit("SUCCESS");
    }, function(error){
        emitter.emit("ERROR", error);
    });

    return emitter;
};

exports.updateCarouselItem = function (id, data) {
    var emitter = new EventEmitter();
    CarouselModel.findOneAndUpdate({carouselItemId: id}, data).then(function(response){
        emitter.emit("SUCCESS");
    }, function(error){
        emitter.emit("ERROR", error);
    });

    return emitter;
};

exports.deleteCarouselItem = function(data) {
    var emitter = new EventEmitter();

    CarouselModel.deleteOne(data).then(function(result){
        if(result['deletedCount'] == 0) {
            emitter.emit('NO_SUCH_PRODUCT');
        } else {
            emitter.emit('DELETED');
        }
        console.log("Result:-", result);
        
    }, function(error){
        emitter.emit('ERROR');
    });
    
    return emitter;
};