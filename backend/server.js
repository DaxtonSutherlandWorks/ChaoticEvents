/**
 * The server lives in this file, it sets up the database conneciton, starts listening on a port defined in .env, and sets up routing.
 */

require('dotenv').config();

const https = require('https')
const cors = require("cors");
const fs = require('fs');

const eventListRoutes = require('./routes/eventLists');
const userRoutes = require('./routes/user');
const express = require('express');
const mongoose = require('mongoose');

// Express app
const app = express();

/* Production HTTPS
const options = {
    cert: fs.readFileSynce(process.env.CERT_PATH, 'utf-8'),
    key: fs.readFileSynce(process.env.KEY_PATH, 'utf-8'),
};
*/

// Middleware
app.use(cors('http://www.daxtonsutherlandworks.com:3000'));

/* Production
app.use(cors('https://www.daxtonsutherlandworks.com:3000'));
*/

app.use(express.json());

app.use((req, res, next) => {
    next();
});

// Routes
app.use('/api/eventLists', eventListRoutes);
app.use('/api/user', userRoutes);

// Connect to db and commence listening
/* Production HTTPS
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // Listen for requests once connected to db
        https.createServer(options, app).listen(process.env.PORT, () => {
            console.log('connected to db and listening on port 4000 through https');
        })
    })   
    .catch((error) => {
        console.log(error);
    })
*/

//Development
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // Listen for requests once connected to db
        app.listen(process.env.PORT, () => {
            console.log('connected to db and listening on port 4000 through http');
        })
    })   
    .catch((error) => {
        console.log(error);
    })

    //© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.