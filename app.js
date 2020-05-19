var express = require('express');
var routes = require('./common/routes');
// var mongoose = require('mongoose');
var cors = require('cors');
var app = express();

app.use(cors());

// Including routes
app.use(routes);

// app.get('/', function(req, res){
//     res.sendFile(__dirname + '/public/index.html');
// });

app.listen(process.env.PORT || 3009, function () {
    console.log('Server is listening at port ....' + (process.env.PORT || 3009));
});