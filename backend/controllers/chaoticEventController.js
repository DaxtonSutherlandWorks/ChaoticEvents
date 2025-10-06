/**
 * DUMMIED: Thought I'd use this for individual event creation/saving/rating. I think it's too niche of a feature
 *          That doesn't add much value. Leaving the components I wrote in case I want to implement it later.
 * A controller to handle all the CRUD (Create, Read, Update, Delete) functions we need for a collection.
 */

const EventList = require('../models/chaoticEventModel');
const mongoose = require('mongoose');

// Get all ChaoticEvents
const getChaoticEvents = async (req, res) => {
    const chaoticEvents = await ChaoticEvent.find({}).sort({createdAt: -1});

    res.status(200).json(chaoticEvents);
}


// Get a single ChaoticEvent
const getChaoticEvent = async (req, res) => {
    const {id} = req.params;

    // Check that given ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such ChaoticEvent'});
    }

    const chaoticEvent = await ChaoticEvent.findById(id);

    // Check that EventList exists
    if (!chaoticEvent) {
        return res.status(404).json({error: 'No such ChaoticEvent'});
    }

    res.status(200).json(chaoticEvent);
}


// Create a new ChaoticEvent
const createChaoticEvent = async (req, res) => {
    const {title, author, body, titleColor, borderColor, rating} = req.body;

    // add ChaoticEvent to database
    try {
        const chaoticEvent = await ChaoticEvent.create({title, author, body, titleColor, borderColor, rating});
        res.status(200).json(chaoticEvent);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

// Delete a ChaoticEvent
const deleteChaoticEvent = async (req, res) => {
    const {id} = req.params;

    // Check that ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such ChaoticEvent'});
    }

    const chaoticEvent = await ChaoticEvent.findOneAndDelete({_id: id});

    // Check that a matching ChaoticEvent was found
    if (!chaoticEvent) {
        return res.status(404).json({error: 'No such ChaoticEvent'});
    }

    res.status(200).json(ChaoticEvent);
}


// Update a ChaoticEvent
const updateChaoticEvent = async (req, res) => {
    const {id} = req.params;

    // Check that given ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such ChaoticEvent'});
    }

    const chaoticEvent = await ChaoticEvent.findOneAndUpdate({_id: id}, {
        ...req.body
    });

    // Check that given ChaoticEvent was found
    if (!chaoticEvent) {
        return res.status(404).json({error: 'No such ChaoticEvent'});
    }

    res.status(200).json(chaoticEvent);
}


module.exports = {
    createChaoticEvent,
    getChaoticEvents,
    getChaoticEvent,
    deleteChaoticEvent,
    updateChaoticEvent
}

//© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.