/**
 * Handles all the routes related to one the eventlists collection.
 */

const express = require('express');
const {
    createEventList,
    getEventList,
    getUserEventLists,
    getEventLists,
    deleteEventList,
    updateEventList,
    getMatches,
    getUserPublic,
    deleteUserLists
} = require('../controllers/eventListController');

const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// GET all public EventLists (newest first)
router.get('/', getEventLists)

// GET single EventList by id
router.get('/edit/:id', getEventList)

// GET all lists that match a set of ids
router.post('/matches', getMatches);

// POST new EventList
router.post('/', createEventList)

// UPDATE an EventList
router.patch('/edit/:id', updateEventList)

// GET a user's public EventLists
router.get("/userPublic/:userName", getUserPublic)

router.use(requireAuth);

// GET all user EventLists
router.get('/user', getUserEventLists)

// DELETE an EventList
router.delete('/edit/:id', deleteEventList)

router.delete('/deleteUserLists', deleteUserLists)


module.exports = router;

//© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.