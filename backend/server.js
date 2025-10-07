/**
 * The server lives in this file, it sets up the database conneciton, starts listening on a port defined in .env, and sets up routing.
 */

require('dotenv').config();
const cors = require("cors");

const eventListRoutes = require('./routes/eventLists');
const userRoutes = require('./routes/user');
const express = require('express');
const mongoose = require('mongoose');

const allowedOrigins = ["http://localhost:3000", "https://chaoticevents-frontend.onrender.com/"];

// Express app
const app = express();



// Middleware
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express.json());

app.use((req, res, next) => {
    next();
});

// Routes
app.use('/api/eventLists', eventListRoutes);
app.use('/api/user', userRoutes);

// Connect to db and commence listening
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // Listen for requests once connected to db
        app.listen(process.env.PORT, () => {
            console.log('connected to db and listening on port 4000');
        })
    })   
    .catch((error) => {
        console.log(error);
    })

    //© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.