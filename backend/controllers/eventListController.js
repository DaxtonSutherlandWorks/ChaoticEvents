/**
 * A controller to handle all the CRUD (Create, Read, Update, Delete) functions we need for a collection.
 */

const EventList = require('../models/eventListModel');
const mongoose = require('mongoose');

const User = require('../models/userModel.js');

// Get chunk of EventLists
const getEventLists = async (req, res) => {

    const cursor = req.headers.cursor

    let query = {public:true};

    if (cursor) {
        query._id = { $lt: cursor };
    }
    
    const eventList = await EventList.find(query).sort({createdAt: -1}).limit(100);

    res.status(200).json(eventList);
}

// Get a user's EventLists
const getUserEventLists = async (req, res) => {

    const userName = req.user.userName;

    const eventLists = await EventList.find({author: userName}).sort({createdAt: -1});

    res.status(200).json(eventLists);
}

// Get all of a user's public EventLists
const getUserPublic = async (req, res) => {
    const {userName} = req.params;

    const eventLists = await EventList.find({author: userName, public: true}).sort({createdAt: -1});

    res.status(200).json(eventLists);
}

// Get a single EventList
const getEventList = async (req, res) => {
    const {id} = req.params;

    // Check that given ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such EventList'});
    }

    const eventList = await EventList.findById(id);

    // Check that EventList exists
    if (!eventList) {
        return res.status(404).json({error: 'No such EventList'});
    }

    res.status(200).json(eventList);
}


// Create a new EventList
const createEventList = async (req, res) => {
    const {title, author, description, rating, events, tags, colorTheme, infoColor, public} = req.body;

    // add EventList to database
    try {
        const eventList = await EventList.create({title, author, description, rating, events, tags, colorTheme, infoColor, public, totalSaves: 0});
        
        // Update user's number of created lists
        await User.findOneAndUpdate({userName: author}, {$inc: {totalLists: 1}});
        
        res.status(200).json(eventList);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

// Delete an EventList
const deleteEventList = async (req, res) => {
    const {id} = req.params;

    // Check that ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such EventList'});
    }

    const eventList = await EventList.findOneAndDelete({_id: id});

    // Check that a matching EventList was found
    if (!eventList) {
        return res.status(404).json({error: 'No such EventList'});
    }

    // Find every User that has interacted with this list.
    const users = await User.find({"eventListInteractions._id": id});

    users.forEach(async (user) => {
        // Cut out the list's interaction
        let idx = user.eventListInteractions.findIndex(interaction => interaction._id === id);
        user.eventListInteractions.splice(idx, 1);

        // Update the database
        const test = await User.findOneAndUpdate({_id: user._id}, {eventListInteractions: user.eventListInteractions}, {new: true} )

    })

    // Update user's number of created lists and total positive favor
    await User.findOneAndUpdate({userName: eventList.author}, {$inc: {totalLists: -1, totalPos: -eventList.rating[0], totalSaves: -eventList.totalSaves}});

    res.status(200).json(eventList);
}


// Update an EventList
const updateEventList = async (req, res) => {
    const {id} = req.params;

    // Check that given ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such EventList'});
    }

    const eventList = await EventList.findOneAndUpdate({_id: id}, {
        ...req.body
    });

    // Check that given EventList was found
    if (!eventList) {
        return res.status(404).json({error: 'No such EventList'});
    }

    res.status(200).json(eventList);
}

// Takes a list of list _ids in the req body and returns any matches from the whole collection
const getMatches = async (req, res) => {
    
    const toFind = req.body;

    const matches = await EventList.find({'_id': {$in: toFind}});

    res.status(200).json(matches);
}

const deleteUserLists = async (req, res) => {
    const {userName} = req.body;
}

module.exports = {
    createEventList,
    getEventLists,
    getUserEventLists,
    getUserPublic,
    getEventList,
    deleteEventList,
    updateEventList,
    getMatches,
    deleteUserLists
}

//© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.