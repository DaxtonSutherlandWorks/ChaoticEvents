/**
 * A controller to Login and Signup users, as well as create JWTs.
 */

// Imports
const User = require('../models/userModel');
const EventList = require('../models/eventListModel.js');
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');


// Creates a token using our User's mongoose assigned ID that expires in 3 days.
const createToken = (_id, userName, email) => {
    return jwt.sign({'_id': _id, 'userName': userName, 'email': email}, process.env.SECRET, { expiresIn: '1d'});
}

// Login User
const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        // Using User's login function
        const user = await User.login(email, password);

        const userName = user.userName;

        // Create Token
        const token = createToken(user._id, userName, email);

        res.status(200).json({token});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

// Signup User
const signupUser = async (req, res) => {
    const {email, password, userName} = req.body;

    try {
        // Using User's signup function
        const user = await User.signup(email, password, userName);

        // Create Token
        const token = createToken(user._id, userName, email);

        res.status(200).json({token});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

// Get WIPList
const getWIPList = async (req, res) => {
    const {email} = req.params;

    try {
        // Using User's getWIPList function
        const list = await User.getWIPList(email);

        res.status(200).json(list);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

// Set WIPList
const setWIPList = async (req, res) => {
    const {email, WIPList} = req.body

    try {

        const user = await User.findOneAndUpdate({email: email}, {eventListWip: WIPList}, {returnOriginal: false});

        res.status(200).json(user.eventListWip);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

// Get SavedLists
const getSavedEventLists = async (req, res) => {
    const {email} = req.params;

    try {

        const list = await User.getSavedEventLists(email);

        res.status(200).json(list);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

// GET eventListInteractions
const getInteractions = async (req, res) => {
    
    const {_id} = req.params;
    
        // Check that given ID is valid
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(404).json({error: 'No such User'});
        }
    
        const user = await User.findById(_id);
    
        // Check that User exists
        if (!user) {
            return res.status(404).json({error: 'No such User'});
        }
    
        res.status(200).json(user.eventListInteractions);
}

/**
 * Update a user's list of interactions by adding/removing a saved list or altering favor
 */
const updateInteractions = async (req, res) => {
    const {list, netFavor, userID, mode} = req.body;
    var updateTargetIndex = -1;
    let affectedList = await EventList.findById(list._id)
    let affectedOwner = await User.findOne({userName: list.author});

    try {
        const user = await User.findById(userID);

        // Searches the user's interactions for an entry for this list
        for (let i = 0; i < user.eventListInteractions.length; i++)
        {
            // Found a match, save index
            if (list._id == user.eventListInteractions[i]._id)
                {
                    updateTargetIndex = i;
                    break;
                }
        }

        // Actual functionality based on mode
        switch (mode)
        {
            // Saves a list
            case "SAVE":
                // If an entry already exists
                if (updateTargetIndex >= 0)
                {
                    // Already saved, should never see but just incase
                    if (user.eventListInteractions[updateTargetIndex].saved == true)
                    {
                        res.status(400).json({error: 'List already saved'});
                    }
                    // Interacted with but not saved
                    else
                    {
                        user.eventListInteractions[updateTargetIndex].saved = true;
                        const result = await User.findOneAndUpdate({_id: userID}, {eventListInteractions: user.eventListInteractions}, {new: true})
                        res.status(200).json(result.eventListInteractions);
                    }
                    
                }
                // Creates new entry and marks as saved
                else
                {
                    user.eventListInteractions.push({_id: list._id, saved: true, favor: 0});
                    const result = await User.findOneAndUpdate({_id: userID}, {eventListInteractions: user.eventListInteractions}, {new: true})
                    res.status(200).json(result.eventListInteractions);
                }

                // Update owner's total saves
                affectedOwner.totalSaves++;
                await User.findOneAndUpdate({_id: affectedOwner._id}, {totalSaves: affectedOwner.totalSaves}, {new: true});

                // Update list's total saves
                affectedList.totalSaves++;
                await EventList.findOneAndUpdate({_id: affectedList._id}, {totalSaves: affectedList.totalSaves}, {new: true});

                break;
            // Unsaves a list
            case "UNSAVE":
                user.eventListInteractions[updateTargetIndex].saved = false;

                // Removes the entry entirely if not rated to save space.
                if (user.eventListInteractions[updateTargetIndex].favor === 0)
                {
                    user.eventListInteractions.splice(updateTargetIndex, 1);
                    const result = await User.findOneAndUpdate({_id: userID}, {eventListInteractions: user.eventListInteractions}, {new: true});
                    res.status(200).json(result.eventListInteractions);
                }

                // Update owner's total saves
                affectedOwner.totalSaves--;
                await User.findOneAndUpdate({_id: affectedOwner._id}, {totalSaves: affectedOwner.totalSaves}, {new: true});

                // Update list's total saves
                affectedList.totalSaves--;
                await EventList.findOneAndUpdate({_id: affectedList._id}, {totalSaves: affectedList.totalSaves}, {new: true});
                
                break;
            //Updates Favor
            case "FAVOR":

                // No interaction exists for this list
                if (updateTargetIndex === -1)
                {
                    user.eventListInteractions.push({_id: list._id, saved: false, favor: 0});
                    updateTargetIndex = user.eventListInteractions.length - 1;
                }
               
                let newFavor = 0;

                switch (netFavor) {
                    //Adding Like, removing dislike
                    case "D->L":
                        affectedList.rating[0]++;
                        affectedList.rating[1]--;
                        affectedOwner.totalPos++;
                        newFavor = 1;
                        break;
                    // Adding Like
                    case "N->L":
                        affectedList.rating[0]++;
                        affectedOwner.totalPos++;
                        newFavor = 1;
                        break;
                    //Removing Like
                    case "L->N":
                        affectedList.rating[0]--;
                        affectedOwner.totalPos--;
                        break;
                    //Removing Dislike
                    case "D->N":
                        affectedList.rating[1]--;
                        break;
                    //Adding Dislike
                    case "N->D":
                        affectedList.rating[1]++;
                        newFavor = -1;
                        break;
                    // Adding Dislike, removing Like
                    case "L->D":
                        affectedList.rating[0]--;
                        affectedList.rating[1]++;
                        affectedOwner.totalPos--;
                        newFavor = -1;
                        break;
                }

                // Update list with new favor in database
                await EventList.findOneAndUpdate({_id: list._id}, {rating: affectedList.rating}, {new: true});

                // Removes interaction if favor was set to neutral and not saved
                if (newFavor === 0 && !user.eventListInteractions[updateTargetIndex].saved)
                {
                    user.eventListInteractions.splice(updateTargetIndex, 1);
                }
                else
                {
                    user.eventListInteractions[updateTargetIndex].favor = newFavor;
                }

                // Update user's eventInteractions
                const result = await User.findOneAndUpdate({_id: userID}, {eventListInteractions: user.eventListInteractions}, {new: true});

                // Update owner's total saves
                await User.findOneAndUpdate({_id: affectedOwner._id}, {totalPos: affectedOwner.totalPos}, {new: true});

                res.status(200).json(result.eventListInteractions);
                break;
        }
    }
    catch (error) {
        console.log(error);
    }
}

// GET WIPList
const getUserProfile = async (req, res) => {
    const {userName} = req.params;

    try {
        // Using User's getUserProfile function
        const list = await User.getUserProfile(userName);

        res.status(200).json(list);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

// Update user profile
const updateProfile = async (req, res) => {
    const {userID, mode, userName, snapshot} = req.body;

    try
    {
        switch (mode)
        {
            case "USERNAME":
                const userNameResult = await User.findByIdAndUpdate({_id: userID}, {userName: userName}, {new: true});
                res.status(200).json(userNameResult);
                break;

            case "SNAPSHOT":
                const snapshotResult = await User.findByIdAndUpdate({_id: userID}, {snapshot: snapshot}, {new: true});
                res.status(200).json(snapshotResult);
                break;
        }
    }
    catch (error)
    {
        if (error.codeName === "DuplicateKey")
        {
            res.status(400).json({error: "This username already exists. Please enter another!"});
        }
        else
        {
            res.status(400).json({error: error.message});
        }
        
    }
}

/**
 * DELETE a user profile. Deletes every list the user has made from the eventLists collection.
 * Deletes all of the user's interactions with other users content and effects on their profiles.
 */
const deleteUser = async (req, res) => {
    const {userID} = req.body;

    const user = await User.findById({_id: userID});

    // Undo all effects of user's interactions
    for (let interaction of user.eventListInteractions)
    {
        var list = await EventList.findById({_id: interaction._id});
        
        // Skips this iteraction if the user own this list
        if (list.author === user.userName)
        {
            continue;
        }

        let listOwner = await User.findOne({ userName: list.author})

        // Updates the list owner's total user saves
        if (interaction.saved)
        {
            listOwner.totalSaves--;
        }

        // Updates the list owner's total positive favor if this list was liked
        if (interaction.favor === 1)
        {
            listOwner.totalPos--;
        }
        
        // Update the owner's totals
        await User.findOneAndUpdate({_id: listOwner._id}, {totalSaves: listOwner.totalSaves, totalPos: listOwner.totalPos}, {new: true});
    }

    // Delete all of users lists. They will be deleted from other users' interactions when access fails.
    await EventList.deleteMany({ author: user.userName});

    // Deletes the user
    let test = await User.findByIdAndDelete(userID);

    res.status(200).json(test);
}

module.exports = { signupUser,
     loginUser, 
     getWIPList, 
     setWIPList, 
     getSavedEventLists, 
     updateInteractions, 
     getInteractions,
     getUserProfile,
     updateProfile,
     deleteUser};

  //© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.