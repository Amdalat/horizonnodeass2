const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'others';

    if (file.fieldname === 'images'){ 
      folder = 'profiles';
    } else if (file.fieldname === 'icon'){ 
      folder = 'caticons';
    }
    cb(null, `./uploads/${folder}`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage });

const app = express();
// const port = process.env.PORT;
const port = 5000;

app.use(express.json());

mongoose.connect(process.env.MONGOURL).then(()=>{
    console.log('CONNECTED TO MONGODB');
}).catch((err) => {
    console.log('NOT CONNECTED TO MONGODB', err);
})

const { createadmin, createmanager, loginadmin, logincustomer, createcustomer, getalladmins, getadminsbyrole, getadmin, updateadmin, deleteadmin } = require("./controller/AuthController");

const { createproduct, getproduct, updateproduct, deleteproduct, getallproducts, createcat, getcat, updatecat, deletecat, getallcats } = require("./controller/ProductController");

const verifytoken = require("./utils/validate");


app.post('/auth/admin/register', createadmin); //check
app.post('/auth/manager/register', verifytoken, createmanager);
app.post('/auth/manager/login', loginadmin);
app.post('/auth/login', logincustomer);
app.post('/auth/signup', createcustomer);
app.get('/managers', verifytoken, getalladmins);
app.get('/managers/:role', verifytoken, getadminsbyrole);
app.get('/manager/:id', verifytoken, getadmin);
app.put('/manager/:id', verifytoken, updateadmin);
app.delete('/manager/:id', verifytoken, deleteadmin);



app.post('/product', upload.single("icon"), createproduct);
app.put('/product/:id', updateproduct);
app.delete('/product/:id', deleteproduct);
app.get('/product/:id', getproduct);
app.get('/products', getallproducts);



app.post('/cat', verifytoken, upload.single("icon"), createcat);
app.put('/cat/:id', verifytoken, updatecat);
app.delete('/cat/:id', verifytoken, deletecat);
app.get('/cat/:id', verifytoken, getcat);
app.get('/cats', verifytoken, getallcats);

app.get('/', (req, res) => {
    res.status(200).json('');
})

app.listen(port, () => {
    console.log(`Port ${port}`);
})