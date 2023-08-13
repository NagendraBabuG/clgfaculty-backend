const express = require('express')
const mongoose= require('mongoose')
const jwt = require('jsonwebtoken')
const Faculty = require('./models/faculty')

const cors = require('cors')
const app = express()
const bcrypt = require('bcrypt')

require('dotenv').config()

const PORT = process.env.PORT || 3000;
//const User = require('./models/user')


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

//app.use('/auth', require('./routes/auth'))



app.get('/', (req, res)=>{
    res.json({msg : 'hello world'})
})




mongoose.set('strictQuery', false)
mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on Port : ${PORT}`)
    })
}).catch((error) => console.log(error.message))