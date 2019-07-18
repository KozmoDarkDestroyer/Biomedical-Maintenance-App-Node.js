const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('../server/config/config');
const app = express();

const public = path.resolve(__dirname,'../public');
app.use(express.static(public));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('./controllers/index'));

mongoose.connect(config.url_mongo, { useNewUrlParser: true, useCreateIndex: true },(err) =>{
    if (err) {
        throw new Error(err)
    }
    console.log('Database online');
})

app.listen(config.port,() =>{
    console.log(`Listening port ${config.port}`);
})


