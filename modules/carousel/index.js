var express = require('express');
var router = express.Router();
var carouselController = require('./carousel.controller');

router.get('/get', carouselController.getCarouselItems);
router.post('/create', carouselController.addCarouselItem);
router.put('/update/:id', carouselController.updateCarouselItem);
router.delete('/delete', carouselController.deleteCarouselItem);
module.exports = router;