var express = require('express');
var mongoose = require('mongoose');
var routes = require('./common/routes');
var cors = require('cors');
var app = express();

// Database connection
var mongoUrl = "mongodb+srv://vipto786:D2CSAHjJe3dnFOmH@cluster0-hsc5k.mongodb.net/emart?retryWrites=true&w=majority";
mongoose.connect(mongoUrl, function (err, connect) {
    if (err) {
        console.log("Error in connecting to mongodb", err);
    } else {
        console.log("Connected to database");
    }
});

app.use(cors());

// Including routes
app.use(routes);

// app.get('/', function(req, res){
//     res.sendFile(__dirname + '/public/index.html');
// });

app.listen(process.env.PORT || 3009, function () {
    console.log('Server is listening at port ....' + (process.env.PORT || 3009));
});