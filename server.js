var express = require('express');
var app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
var port = 3000;
require('dotenv').config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false,
  'optionsSuccessStatus': 204
}
));
const connectDB = require('./config/db');
connectDB();
app.get('/', function (req, res) {
  res.send('Hello World!');
});
const indexRouter = require('./routes/index');
app.use('/', indexRouter);
app.listen(port, function () {
  console.log('Server running on port ' + port);
});