const mongoose = require('mongoose')

const Schema = mongoose.Schema
var objectId = Schema.objectId
const facultySchema = new Schema({
    name: {
        type: String, required: true
    },

    email: {
        type: String, unique: true, required: true
    },
    image : {
        type : Buffer, contentType : String, required: false
    },
    contact: {
        type: String, default: null
    },
    position : {
        type : String, default : null
    },

    Organization: {
        type: String, default:null
    },
    uid: { type: String, required: true, unique: true },
    Publications : [{type: mongoose.Schema.Types.ObjectId,unique : true, default:[]}],

    Education : [{type: mongoose.Schema.Types.ObjectId,unique : true, default:[]}],

    Projects : [{type: mongoose.Schema.Types.ObjectId,unique : true, default:[]}],
    
    // researchScholars : [{type: mongoose.Schema.Types.ObjectId,unique : true, default:[]}],
    
    AreasOfInterest : {type : String, default: null},
    image: {
        data: Buffer, // Store image data as Buffer
        contentType: String // Store image content type
    },
    coursesTaught : [{
        type : String, default : null
    }],
    
    Address : {
        type : String, default: null
    },
    Year : {
        type : String, default : null
    }

}, { timestamps: true })

const faculty = mongoose.model('faculty', facultySchema)
module.exports = faculty