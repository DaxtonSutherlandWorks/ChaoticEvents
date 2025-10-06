/**
 * This is a model used with Mongoose to give structure to database entries within collections.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Represents an event list object to be rendered within the UI.
 * 
 * Params:
 *  title-String: The lists title
 *  author-String: The author name of the user that made this list
 *  description-String: A short description of the list
 *  rating-[Number, Number]: An array containing likes and dislikes respectivley
 *  events-[{}]: An array of the events contained within the list.
 *  colorTheme-[String, String]: Primary/secondary hex code colors.
 *  tags-[Stirng]: Tags for searching
 *  public-Boolean: Denotes whether the list should appear in other user's searches
 *  totalSaves-Number: Shows how many times the list has been saved, used for user profiles.
 */
const eventListSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: String,
    description: {
        type: String,
        reuired: true
    },
    rating: [Number, Number],
    events: {
        type: [{}],
        required: true
    },
    colorTheme: [],
    tags: [String],
    public: Boolean,
    totalSaves: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('EventList', eventListSchema);

//© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.