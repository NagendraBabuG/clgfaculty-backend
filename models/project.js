const mongoose = require('mongoose')

const Schema = mongoose.Schema
var objectId = Schema.objectId
const projectSchema = new Schema({
    title: {
        type: String, required: true
    },
    sponsoredBy : {
        type: String, required : true
    },
    role : {
        type : String, required : true
    },
    duration : {
        type : String, required : true
    },
    status : {
        type : String, requreid : true
    }

}, { timestamps: true })

const project = mongoose.model('project', projectSchema)
module.exports = project