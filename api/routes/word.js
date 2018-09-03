var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Word = require('../models/Word.js');

/* GET ALL Words */
router.get('/', function(req, res, next) {
  Word.find(function (err, products) {
    if (err) return next(err);
    res.json(products);
  });
});

/* GET SINGLE Word BY ID */
router.get('/:id', function(req, res, next) {
  Word.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SAVE Word */
router.post('/', function(req, res, next) {
  Word.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* UPDATE Word */
router.put('/:id', function(req, res, next) {
  Word.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE Word */
router.delete('/:id', function(req, res, next) {
  Word.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
