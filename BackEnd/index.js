var express = require('express');
var app = express();
var cors = require('cors')
var morgan = require('morgan')

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send("Hello world!");
});

app.listen(8000, "0.0.0.0" ,function () {
    console.log('Example app listening on port 3000! http://localhost:8000');
});