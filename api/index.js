const express = require('express')

// var favicon = require('serve-favicon')
var logger = require('morgan')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var cors = require('cors')

// Create express instnace
const app = express()
app.use(cors())

let uri = ''
if (process.env.DEV_HOST !== undefined ||
    process.env.NODE_ENV === 'development') {
  console.log('use local database');
  uri = 'mongodb://127.0.0.1:27017/english-card'
} else {
  console.log('use production database');
  uri = 'mongodb://heroku_l087wd94:6ufch8odl4g1c7hi7fom13pdkq@ds141952.mlab.com:41952/heroku_l087wd94'
}

console.log('**** data base uri :', uri);

mongoose.Promise = require('bluebird');
mongoose.connect(uri, { useMongoClient: true, promiseLibrary: require('bluebird') })
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));

// Import API Routes
// NOTE: !!!IMPORTANT!!!
//       bodyparserの設定の後にルーターの設定を行う必要がある。
//       そうでないとpostの際にrequestのbodyがundefinedになる。
// Require API routes
const users = require('./routes/users')
const word = require('./routes/word');
const search = require('./routes/search')

app.use(users)
app.use('/word', word);
app.use('/search', search);


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}
