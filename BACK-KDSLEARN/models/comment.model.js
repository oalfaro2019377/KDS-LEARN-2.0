'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentSchema = Schema({
    title: String,
    comm: String,
    link1: String,
    link2: String,
    link3: String,
    link4: String,
    link5: String,
})
module.exports = mongoose.model('comment', commentSchema);