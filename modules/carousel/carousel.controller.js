var CarouselService = require("./carousel.service");

exports.getCarouselItems = function (req, res) {
  var data = req.body;
  CarouselService.getCarouselItems(data)
    .on("SUCCESS", function (response) {
      res.status(200).send({
        code: "5000",
        data: response
      });
    })
    .on("ERROR", function () {
      res.status(404).send({
        code: 5003,
        message: "Error while getting carousel",
      });
    })
};

exports.addCarouselItem = function(req, res) {
  var data = req.body;
  CarouselService.addCarouselItem(data)
  .on("SUCCESS", function () {
    res.status(200).send({
      code: "5000",
      message: "Carousel item added successfully"
    });
  })
  .on("ERROR", function (error) {
    res.status(404).send({
      code: 5003,
      message: "Error while adding a carousel item.",
      error: error
    });
  })
};

exports.updateCarouselItem = function(req, res) {
  var data = req.body;
  var id = req.params.id;
  CarouselService.updateCarouselItem(id, data)
  .on("SUCCESS", function () {
    res.status(200).send({
      code: "5000",
      message: "Carousel item updated successfully"
    });
  })
  .on("ERROR", function (error) {
    res.status(404).send({
      code: 5003,
      message: "Error while updating a carousel item.",
      error: error
    });
  })
};

exports.deleteCarouselItem = function(req, res) {
  var obj = req.body;
  CarouselService.deleteCarouselItem(obj)
  .on('DELETED', function() {
      res.send({
          message: "Successfully Deleted."
      });
  })
  .on('NO_SUCH_PRODUCT', function() {
      res.send({
          message: "Allready Deleted."
      });
  })
  .on('ERROR', function() {
      res.send({
          message: "Some error occured in deletion."
      });
  });
};
