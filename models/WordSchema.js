const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const WordSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    videoUrl: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("words", WordSchema);