const mongoose = require('mongoose')

const Schema = mongoose.Schema
var objectId = Schema.objectId
const publicationSchema = new Schema({
    title: {
        type: String, required: true
    },
    DOI : {
        type: String, required : true
    },
    date : {
        type : String, required : true
    }

}, { timestamps: true })

const faculty = mongoose.model('publication', publicationSchema)
module.exports = faculty