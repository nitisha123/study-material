const express = require("express");
const router = express.Router();
const multer  = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1]);
    }
});
const upload = multer({storage: storage});

const auth = require('../middleware/auth');

// Load input validation
const validateWordInput = require("../../validation/word");

// Load User model
const Word = require("../../models/WordSchema");

// @route POST api/words
// @desc Create Word
// @access only by loggedIn user

router.post("", auth, upload.single('image'), async (req, res) => {
    try {
        //Form validation
        const {errors, isValid} = await validateWordInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }
        const word = await Word.findOne({title: req.body.title});
        if (word && word._id) {
            await fs.unlink(path.join(__dirname, "./../../public/" + req.file.filename), (err) => {
                if(err) return console.log(err);
                return res.status(400).json({title: "Title already exists"});
            });
        } else {
            const newWord = new Word({
                title: req.body.title,
                description: req.body.description,
                color: req.body.color,
                videoUrl: req.body.videoUrl,
                image: req.file.filename
            });
            const wordData = await newWord.save();
            res.json(wordData);
        }
    } catch (err) {
        console.log('err', err);
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
        const words = await Word.find({});
        res.json(words);
    } catch (err) {
        return res
            .status(500)
            .json({internalServerError: "Internal Server Error"});
    }
});

// @route GET api/words/:id
// @desc Get word of the particular id
// @access loggedIn user

router.get("/:id", auth, async (req, res) => {
    try {
        if (req.params.id) {
            const wordData = await Word.findOne({_id: req.params.id});
            wordData.image = await base64_encode(path.join(__dirname, "./../../public/" + wordData.image));
            res.json(wordData);
        } else {
            return res
                .status(400)
                .json({inadequateData: "Inadequate Data"});
        }
    } catch (err) {
        console.log('err =================', err);
        return res
            .status(500)
            .json({internalServerError: "Internal Server Error"});
    }
});

const base64_encode = (file) => {
    // read binary data
    const bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
};

// @route PUT api/words/:id
// @desc Update details of word of the particular id
// @access loggedIn user

router.put("/:id", auth, upload.single('image'), async (req, res) => {
    try {
        if (req.params.id) {
            const wordData = await Word.findOne({_id: req.params.id});
            if (wordData && wordData._id) {
                if (req.file && req.file.filename) {
                    await fs.unlink(path.join(__dirname, "./../../public/" + wordData.image), (err) => {
                        if(err) return console.log(err);
                        req.body.image = req.file.filename;
                    });
                }
                const data = await Word.updateOne({_id: req.params.id}, req.body);
                const updatedData = await Word.findOne({_id: req.params.id});
                res.json(updatedData);
            } else {
                if (req.file && req.file.filename) {
                    await fs.unlink(path.join(__dirname, "./../../public/" + req.file.filename), (err) => {
                        if (err) return console.log(err);
                    });
                }
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

// @route DELETE api/words/:id
// @desc Get word of the particular id
// @access loggedIn user

router.delete("/:id", auth, async (req, res) => {
    try {
        if (req.params.id) {
            const wordData = await Word.deleteOne({_id: req.params.id});
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