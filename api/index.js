const express = require('express')

// var favicon = require('serve-favicon')
var logger = require('morgan')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

// Create express instnace
const app = express()

let uri = ''
if (process.env.NODE_ENV !== undefined ||
    process.env.NODE_ENV === 'development') {
  console.log('use local database');
  uri = 'mongodb://127.0.0.1:27017/english-card'
} else {
  console.log('use production database');
  uri = 'mongodb://heroku_l087wd94:6ufch8odl4g1c7hi7fom13pdkq@ds141952.mlab.com:41952/heroku_l087wd94'
}

console.log('**** data base uri :', uri);

// Require API routes
const users = require('./routes/users')
const word = require('./routes/word');

mongoose.Promise = require('bluebird');
mongoose.connect(uri, { useMongoClient: true, promiseLibrary: require('bluebird') })
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

// Import API Routes
app.use(users)
app.use('/word', word);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}
