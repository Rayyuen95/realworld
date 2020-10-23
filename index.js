const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//Imoort Routes
const authRoute = require('./routes/auth');
dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT,
{ useNewUrlParser: true },
() => console.log('connect to db!'));

//Middleware
app.use(express.json());


//Route Middlewares
app.use('/api/user', authRoute);

app.listen(8888, () => console.log('Server up and running!!'));
