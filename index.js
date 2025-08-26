const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 5000;
app.use(express.json());

mongoose.connect(process.env.MONGOURL).then(()=>{
    console.log('CONNECTED TO MONGODB');
}).catch((err) => {
    console.log('NOT CONNECTED TO MONGODB', err);
})

const { createmanager, loginadmin, logincustomer, createcustomer, getalladmins, getadminsbyrole, getadmin, updateadmin, deleteadmin } = require("./controller/AuthController");
const verifytoken = require("./utils/validate")

app.post('/auth/manager/register', verifytoken, createmanager);
app.post('/auth/manager/login', loginadmin);
app.post('/auth/login', logincustomer);
app.post('/auth/signup', createcustomer);
app.get('/managers', verifytoken, getalladmins);
app.get('/managers/:role', verifytoken, getadminsbyrole);
app.get('/manager/:id', verifytoken, getadmin);
app.put('/manager/:id', verifytoken, updateadmin);
app.delete('/manager/:id', verifytoken, deleteadmin);

app.get('/', (req, res) => {
    res.status(200).json('');
})

app.listen(port, () => {
    console.log(`Port ${port}`);
})