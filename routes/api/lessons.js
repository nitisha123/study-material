const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

const auth = require('../middleware/auth');

// Load input validation
const validateLessonInput = require("../../validation/lesson");

// Load User model
const Lesson = require("../../models/LessonSchema");

// @route POST api/lessons
// @desc Create Lesson
// @access only by loggedIn user with the userType "TEACHER"

router.post("", auth, async (req, res) => {
    try {

        //Form validation
        const {errors, isValid} = await validateLessonInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }
        const lesson = await Lesson.findOne({title: req.body.title});
        if (lesson && lesson._id) {
            return res.status(400).json({title: "Title already exists"});
        } else {
            const newLesson = new Lesson({
                title: req.body.title,
                description: req.body.description
            });
            const lessonData = await newLesson.save();
            res.json(lessonData);
        }
    } catch (err) {
        return res
            .status(500)
            .json({internalServerError: "Internal Server Error"});
    }

});

// @route GET api/lessons
// @desc Get list of all Lessons
// @access loggedIn user

router.get("", auth, async (req, res) => {
    try {
        const lessons = await Lesson.find({});
        res.json(lessons);
    } catch (err) {
        return res
            .status(500)
            .json({internalServerError: "Internal Server Error"});
    }
});

// @route GET api/lessons/:id
// @desc Get lesson of the particular id
// @access loggedIn user

router.get("/:id", auth, async (req, res) => {
    try {
        if (req.params.id) {
            const lessonData = await Lesson.findOne({_id: req.params.id});
            res.json(lessonData);
        } else {
            return res
                .status(400)
                .json({inadequateData: "Inadequate Data"});
        }
    } catch (err) {
        return res
            .status(500)
            .json({internalServerError: "Internal Server Error"});
    }
});

// @route PUT api/lessons/:id
// @desc Update details of lesson of the particular id
// @access loggedIn user with userType "TEACHER"

router.put("/:id", auth, async (req, res) => {
    try {
        if (req.params.id) {
            const lessonData = await Lesson.findOne({_id: req.params.id});
            if (lessonData && lessonData._id) {
                const data = await Lesson.updateOne({_id: req.params.id}, req.body);
                const updatedData = await Lesson.findOne({_id: req.params.id});
                res.json(updatedData);
            } else {
                return res.status(400).json({invalidId: "Invalid ID"});
            }
        } else {
            return res
                .status(400)
                .json({inadequateData: "Inadequate Data"});
        }
    } catch (err) {
        return res
            .status(500)
            .json({internalServerError: "Internal Server Error"});
    }
});

// @route DELETE api/lessons/:id
// @desc Get lesson of the particular id
// @access loggedIn user

router.delete("/:id", auth, async (req, res) => {
    try {
        if (req.params.id) {
            const lessonData = await Lesson.deleteOne({_id: req.params.id});
            res.json({success: "Deleted Successfully"});
        } else {
            return res
                .status(400)
                .json({inadequateData: "Inadequate Data"});
        }
    } catch (err) {
        return res
            .status(500)
            .json({internalServerError: "Internal Server Error"});
    }
});

module.exports = router;