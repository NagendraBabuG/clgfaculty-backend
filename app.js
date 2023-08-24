const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const admin = require('./config/firebase-config')
const Faculty = require('./models/faculty')
const app = express();
require('dotenv').config()
const PORT = process.env.port || 5000;
const CONNECTION_URL = process.env.CONNECTION_URL;
app.use(cors());
app.use(express.json())


app.use('/api', require('./routes/index'))
app.get('/',(req,res) => {
   // console.log(req);
    res.send('Hello World');
})


app.post('/createUser', async(req, res) => {
    console.log(req.body, "body")
    const idToken = req.body.id
    const decodeToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodeToken.uid;
    console.log(uid)
    if(!uid) return res.status(400).json({status : 'error'})
    const existingUser = await Faculty.findOne({ uid });
    if(existingUser)
    {
        return res.status(200).json({status : 'success', data : existingUser})
    }

    const useremail = req.body.email, username = req.body.name
    if(!useremail || !username) return res.status(400).json({status : 'failed', data: "missing data"});

    // const session = await mongoose.startSession();
    // session.startTransaction();
    // let userAdded = undefined
    
    try{
        // make it like transaction
        // still u didn't add employee details for authentication
        // userAdded = await admin.auth().createUser(
        //     {
        //         email: useremail,
        //         displayName: username
        //     }, {session})
        //    // console.log(userAdded)
        //     const db = admin.firestore()
        //     const userRef = db.collection('employees').doc(userAdded.uid);

        //     // Create the user document with some initial data
        //     await userRef.set({
        //       email: useremail,
        //       displayName:username,
        //       role: 'admin',
        //       createdAt: admin.firestore.FieldValue.serverTimestamp(),
        //       // Add any 
        //     })
        
        const newfaculty = await Faculty.create({
            uid : uid,
            name : username, 
            email : useremail
        })
      //  console.log(newfaculty)
       // await session.commitTransaction();
       // console.log(userAdded)
        res.status(200).json({status : 'success', data : userAdded})
        
    }
    catch(error)
    {
        if(error.code == 'auth/email-already-exists') return res.status(400).json({status : 'email already exits'})
        // If an error occurs during the transaction, delete the user in Firebase Authentication
        //console.error('Transaction aborted:', error);
        console.log(error)
        res.status(400).json({status : "error in connected Database", data: error})   
    }

})
mongoose.set('strictQuery', false)
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on Port : ${PORT}`)
    })
}).catch((error) => console.log(error.message))