const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const LessonSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("lessons", LessonSchema);