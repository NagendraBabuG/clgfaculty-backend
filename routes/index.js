const express = require("express")
const mongoose = require('mongoose')
const Faculty = require('../models/faculty')
const Education = require('../models/education')
const Project = require('../models/project')
const Publication = require('../models/publication')



const router = express.Router()

//router.use(middleware)

router.get('/', async (req, res)=> {
    res.status(200).json({status : "it's working!!!"})
})



module.exports = router