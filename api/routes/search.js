var express = require('express');
var router = express.Router();
const axios = require('axios');

router.get('/', function(req, res, next) {
  console.log('*** search word:', req.query.word);
  axios.get('https://glosbe.com/gapi/translate',
    {'headers': {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    },
    params: {
      from: 'en',
      dest: 'ja',
      format: 'json',
      phrase: req.query.word
    }
    })
    .then(response => {
      const data = response.data
      if (hasMeanings(data)) {
        if (data.tuc.length < 3) {
          res.json(data.tuc[0].phrase.text)
        } else {
          // NOTE: 上位3つのデータを返す
          let meanings = ''
          for (let i = 0; i < 3; i++) {
            if (i !== 0) {
              meanings += '、 '
            }

            meanings += data.tuc[i].phrase.text
          }
          res.json(meanings)
        }
      } else {
        res.json(null)
      }
    })
    .catch(e => {
      console.log('word json error')
      next(e);
    })
});

function hasMeanings(data) {
  return data.tuc.length > 0
}

module.exports = router;
