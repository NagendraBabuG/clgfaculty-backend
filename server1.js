const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const Faculty = require('./models/faculty')
const app = express();
const PORT = process.env.port || 5000;
const CONNECTION_URL = 'mongodb+srv://nagendra:1234@cluster0.fucrlal.mongodb.net/?retryWrites=true&w=majority'
app.use(cors());
app.use(express.json())

app.use('/api/faculty', require('./routes/index'))
app.get('/',(req,res) => {

    res.send('Hello World');
})

mongoose.set('strictQuery', false)
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on Port : ${PORT}`)
    })
}).catch((error) => console.log(error.message))
