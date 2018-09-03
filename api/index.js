const express = require('express')

// var favicon = require('serve-favicon')
var logger = require('morgan')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

// Create express instnace
const app = express()
const uri = 'mongodb://heroku_l087wd94:6ufch8odl4g1c7hi7fom13pdkq@ds141952.mlab.com:41952/heroku_l087wd94'
// Require API routes
const users = require('./routes/users')
const book = require('./routes/book');

const port = process.env.PORT || 3000

mongoose.Promise = require('bluebird');
mongoose.connect(uri, { useMongoClient: true, promiseLibrary: require('bluebird') })
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

// Import API Routes
app.use(users)
app.use('/book', book);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}
