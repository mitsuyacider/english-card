var mongoose = require('mongoose');

var enjpSentenceSchema = new mongoose.Schema({
  sentenceEn: String,
  sentenceJp: String,
});

module.exports = mongoose.model('enjpSentences', enjpSentenceSchema);
