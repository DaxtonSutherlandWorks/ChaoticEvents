const express = require('express');

// Controller functions
const { signupUser,
        loginUser,
        getWIPList,
        setWIPList,
        getSavedEventLists,
        updateInteractions,
        getInteractions,
        getUserProfile,
        updateProfile, 
        deleteUser} = require('../controllers/userController');

const requireAuth = require('../middleware/requireAuth');

const router = express.Router();


// Login Route
router.post('/login', loginUser);

// Signup Route
router.post('/signup', signupUser);

// Fetch a user's profile information
router.get('/getProfile/:userName', getUserProfile)

// Routes below require authorization
router.use(requireAuth);

// Set WIP List
router.post('/setWIP', setWIPList);

// Update user's list interactions
router.patch('/updateInteractions', updateInteractions);

// Update user profile
router.patch('/updateProfile', updateProfile);

// DELETE User
router.delete('/deleteUser', deleteUser);

// Get a User by ID
router.get('/interactions/:_id', getInteractions);

// Fetch user's saved lists
router.get('/:email/savedLists', getSavedEventLists);

// Fetch WIP List
router.get('/:email/getWIP', getWIPList);

module.exports = router;

//© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.