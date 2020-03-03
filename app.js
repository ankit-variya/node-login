const express = require('express');
const app = express();
const bodyParser = require('body-parser');  
const mongoose = require('mongoose');
const user_routes = require('./routes/user');
require('dotenv').config();

mongoose.set('useCreateIndex', true);
mongoose.connect(
    "mongodb://localhost:27017/next-pro",
    { useNewUrlParser: true, useUnifiedTopology: true},
    err => {
        if(err) throw err.message;
        console.log('mongodb connection successfully');
    },
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', user_routes);

app.listen(process.env.PORT , ()=> {
    console.log('server started on', process.env.PORT);
})