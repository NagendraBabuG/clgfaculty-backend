const mongoose = require('mongoose')

const Schema = mongoose.Schema
var objectId = Schema.objectId
const educationSchema = new Schema({
    instituteName: {
        type: String, required: true
    },

    Degree: {
        type: String, unique: true, required: true
    },
    start: {
        type: String, default: null
    },
    end : {
        type : String, default : null
    },
    remarks : {
        type : String, default: null
    }


}, { timestamps: true })

const education = mongoose.model('education', educationSchema)
module.exports = education