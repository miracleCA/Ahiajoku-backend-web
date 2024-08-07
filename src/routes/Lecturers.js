import express from 'express';
import { verifyToken } from '../Auth.js';
import mongoose from 'mongoose';
import multer from 'multer';
import { LecturerModel } from "../models/Lecturers.js"

const LecturerRoutes = express.Router();

express().use(express.static('./src/Files'));
express().use(express.urlencoded({extended: false}));
express().set('view engine', 'ejs')

const store = multer.memoryStorage();
const upload = multer({ storage: store });

LecturerRoutes.get('/', verifyToken, async (req, res) => {
    try {
        const result = await LecturerModel.find({});
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

LecturerRoutes.get("/:lecturerid", verifyToken, async (req, res) => {
    try {
      const result = await LecturerModel.findById(req.params.lecturerid);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
});

LecturerRoutes.post("/", verifyToken, upload.single("picture"), async (req, res) => {
    const lecturer = new LecturerModel({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        biography: req.body.biography,
        picture: { 
            data: req.file.buffer,
            contentType: req.file.mimetype 
        }
    });
    try {
        const result = await lecturer.save();
        res.status(201).json({
            new_lecturer: {
                title: result.title,
                firstname: result.firstname,
                lastname: result.lastname,
                email: result.email,
                biography: result.biography,
                picture: result.picture,
                _id: result._id
            }
        });
    }
    catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

LecturerRoutes.put("/:lecturerid", verifyToken, upload.single("picture"), async(req, res) => {
    try {
        const lecturer = req.params.lecturerid;
        const updatedData = req.body;
        const options = { new: true };

        const result = await LecturerModel.findByIdAndUpdate(
            { _id: lecturer}, updatedData, options
        )
        res.status(200).json(result);
        console.log(result);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

LecturerRoutes.delete("/:lecturerid", verifyToken, async (req, res) => {
    try {
        const lecturer = req.params.lecturerid;
        const deletedLecturer = req.body;
        const options = {new: false}
        const result = await LecturerModel.findByIdAndDelete(
            {_id: lecturer}, deletedLecturer, options
        )
        res.status(200).json(result);
        console.log(result);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
})

export default LecturerRoutes;
