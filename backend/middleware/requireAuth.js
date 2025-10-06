/**
 * A piece of middle ware to protect our routes that require users to be logged in by
 * checking for a JWT, decoding it to get a user id, and checking that the user exists.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const requireAuth = async (req, res, next) => {

    // Verify Authenticaiton (Grabs JWT)
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({error: 'Authorization token required'});
    }

    // Splits and discards the property name from the actual JWT
    const token = authorization.split(' ')[1];

    try {
        // Decodes JWT to get user id
        const _id = jwt.verify(token, process.env.SECRET);

        // Searches database for User with decoded ID
        req.user = await User.findOne({_id}).select('userName');
        next();

    } catch (error) {

        //This block seeks to catch errors with invalid JWTs or nonexistant users
        
        if (error.name === 'TokenExpiredError')
        {
            res.status(401).json({error: 'Expired token'});
        }

        else
        {
            res.status(401).json({error: 'Request is not authorized'});  
        }
        
    }
}

module.exports = requireAuth;

//© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.