'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var fileSchema = Schema({
    image: String,
})
module.exports = mongoose.model('file', fileSchema);