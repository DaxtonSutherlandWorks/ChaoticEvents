/**
 * DUMMIED: Thought I'd use this for individual event creation/saving/rating. I think it's too niche of a feature
 *          That doesn't add much value. Leaving the components I wrote in case I want to implement it later.
 * This is a model used with Mongoose to give structure to database entries within collections.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Represents an event object to be created by users and used in lists.
 * 
 * Params:
 *  _id-Number: Mongoose generated, id to be used in react list
 *  title-String: The event's title
 *  author-String: Creator's Username
 *  body-String: The text of the event.
 *  titleColor-String: Used to set the color of the title in the UI
 *  borderColor-String: Used to set the border color in the UI
 *  ratings-{Number, Number}: Likes/dislikes
 */
const chaoticEventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: String,
    body: {
        type: String,
        reuired: true
    },
    titleColor: String,
    borderColor: String,
    ratings: [Number, Number]
}, { timestamps: true });

module.exports = mongoose.model('ChaoticEvent', chaoticEventSchema);

//© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.