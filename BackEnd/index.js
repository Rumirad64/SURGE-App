var express = require('express');
var app = express();
var cors = require('cors')
var morgan = require('morgan')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
require('dotenv').config()

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//! user controller
const user = require('./controllers/user/index.js');
app.use('/api/user', user)



app.get('/', function (req, res) {
    res.json("Hello world!");
});


mongoose.connect(process.env.DB_CON_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(error => console.log(error));


const connection = mongoose.connection;
connection.once("open", () => {
    console.log("Successfully connected to MongoDB");
    console.log(`Database -> ${connection.db.databaseName}`);
});



app.listen(8000, "127.0.0.1", function () {
    console.log('Example app listening on port 8000! http://localhost:8000');
});