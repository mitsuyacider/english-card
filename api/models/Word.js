var mongoose = require('mongoose');

var enjpWordSchema = new mongoose.Schema({
  wordEn: String,
  wordJp: String,
});

module.exports = mongoose.model('enjpWord', enjpWordSchema);
