const express = require("express")
const mongoose = require('mongoose')
const Faculty = require('../models/faculty')
const Education = require('../models/education')
const Project = require('../models/project')
const Publication = require('../models/publication')

const middleware = require('../middleware/validateToken')

const router = express.Router()

router.use(middleware)

router.get('/', async (req, res)=> {
    res.status(200).json({status : "it's working!!!"})
})



router.put('/update', async (req, res) => {
    try {
      
      const decodeToken = await admin.auth().verifyIdToken(req.body.id);
      const uid = decodeToken.uid;
      console.log(req.body)
      const facultyId = uid
      const updatedFacultyData = req.body;
      const updatedImageData = req.body.image; // Assuming you're sending image data in the request body
      const updatedImageContentType = req.body.imageContentType;
      const updateFields = { ...updatedFacultyData };
      if (updatedImageData) {
        // Only update the image if updatedImageData is provided
        updateFields.image = {
            data: updatedImageData,
            contentType: updatedImageContentType
          };
      }
      const updatedFaculty = await Faculty.findByIdAndUpdate(
        facultyId,
        updateFields,
        { new: true } // Return the updated document
      );
        
      res.json(updatedFaculty);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

module.exports = router