var mongoose = require('mongoose');

var enjpWordSchema = new mongoose.Schema({
  WordEN: String,
  WordJP: String,
});

module.exports = mongoose.model('enjpWord', enjpWordSchema);
