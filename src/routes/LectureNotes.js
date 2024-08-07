import express from 'express';
import { verifyToken } from '../Auth.js';
import mongoose from 'mongoose';
import multer from 'multer';
import { LectureNotesModel } from "../models/LectureNotes.js"

const LectureNotesRoutes = express.Router();

express().use(express.static('./src/Files'));
express().use(express.urlencoded({extended: false}));
express().set('view engine', 'ejs')

const store = multer.memoryStorage();
const upload = multer({ storage: store });

LectureNotesRoutes.get('/', verifyToken, async (req, res) => {
    try {
        const result = await LectureNotesModel.find({});
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

LectureNotesRoutes.get("/:lecturenoteid", verifyToken, async (req, res) => {
    try {
      const result = await LectureNotesModel.findById(req.params.lecturenoteid);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
});

LectureNotesRoutes.post("/", verifyToken, upload.single("coverImage"), async (req, res) => {
    const lectureNote = new LectureNotesModel({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        author: req.body.author,
        date: req.body.date,
        note: req.body.note,
        coverImage: { 
            data: req.file.buffer,
            contentType: req.file.mimetype 
        }
    });
    try {
        const result = await lectureNote.save();
        res.status(201).json({
            new_lecture_note: {
                title: result.title,
                author: result.author,
                date: result.date,
                note: result.note,
                coverImage: result.coverImage,
                _id: result._id
            }
        });
    }
    catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

LectureNotesRoutes.put("/:lecturenoteid", verifyToken, upload.single("coverImage"), async(req, res) => {
    try {
        const lectureNote = req.params.lecturenoteid;
        const updatedData = req.body;
        const options = { new: true };

        const result = await LectureNotesModel.findByIdAndUpdate(
            { _id: lectureNote}, updatedData, options
        )
        res.status(200).json(result);
        console.log(result);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

LectureNotesRoutes.delete("/:lecturenoteid", verifyToken, async (req, res) => {
    try {
        const lectureNote = req.params.lecturenoteid;
        const deletedLectureNote = req.body;
        const options = {new: false}
        const result = await LectureNotesModel.findByIdAndDelete(
            {_id: lectureNote}, deletedLectureNote, options
        )
        res.status(200).json(result);
        console.log(result);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
})

export default LectureNotesRoutes;
