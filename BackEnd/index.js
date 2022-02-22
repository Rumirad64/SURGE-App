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



const server = app.listen(process.env.PORT, process.env.ADDRESS, function () {
    console.log(`Server is running on http://${server.address().address}:${server.address().port}`);
});