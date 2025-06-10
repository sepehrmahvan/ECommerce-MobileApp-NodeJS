const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const app = express();

app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use('/api/v1/feed', feedRoutes);
app.use('/api/v1/auth', authRoutes);


mongoose.connect('mongodb://127.0.0.1:27017/bannerTJ').then((result) => {
    app.listen(8080);
}).catch((err) => {
    console.log(err);
});
