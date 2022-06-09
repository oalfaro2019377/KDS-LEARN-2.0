'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ratingSchema = Schema({
    rate: String
})

module.exports = mongoose.model('rating', ratingSchema);