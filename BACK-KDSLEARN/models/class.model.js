'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var classSchema = Schema({
    name: String,
    description: String,
    teacher: {type: Schema.ObjectId, ref: 'user'},
    student: [{type: Schema.ObjectId, ref: 'user'}],
    video: String,
    rating: 0,
    voters: 0,
    average: Number,
    comments: [{
        title: String,
        comm: String,
        link1: String,
        link2: String,
        link3: String,
        link4: String,
        link5: String,
    }],
    files: [
          ]
})

module.exports = mongoose.model('class', classSchema);
