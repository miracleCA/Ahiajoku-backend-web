import express from 'express';
import { verifyToken } from '../Auth.js';
import mongoose from 'mongoose';
import multer from 'multer';
import { GalleryModel } from "../models/Gallery.js"

const GalleryRoutes = express.Router();

express().use(express.static('./src/Files'));
express().use(express.urlencoded({extended: false}));
express().set('view engine', 'ejs')

const store = multer.memoryStorage();
const upload = multer({ storage: store });

GalleryRoutes.get('/', verifyToken, async (req, res) => {
    try {
        const result = await GalleryModel.find({});
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

GalleryRoutes.get("/:galleryid", verifyToken, async (req, res) => {
    try {
      const result = await GalleryModel.findById(req.params.galleryid);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
});

GalleryRoutes.post("/", verifyToken, upload.single("image"), async (req, res) => {
    const gallery = new GalleryModel({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        image: { 
            data: req.file.buffer,
            contentType: req.file.mimetype 
        }
    });
    try {
        const result = await gallery.save();
        res.status(201).json({
            new_gallery: {
                title: result.title,
                description: result.description,
                image: result.image,
                _id: result._id
            }
        });
    }
    catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

GalleryRoutes.put("/:galleryid", verifyToken, upload.single("image"), async(req, res) => {
    try {
        const gallery = req.params.galleryid;
        const updatedData = req.body;
        const options = { new: true };

        const result = await GalleryModel.findByIdAndUpdate(
            { _id: gallery}, updatedData, options
        )
        res.status(200).json(result);
        console.log(result);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

GalleryRoutes.delete("/:galleryid", verifyToken, async (req, res) => {
    try {
        const gallery = req.params.galleryid;
        const deletedGallery = req.body;
        const options = {new: false}
        const result = await GalleryModel.findByIdAndDelete(
            {_id: gallery}, deletedGallery, options
        )
        res.status(200).json(result);
        console.log(result);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
})

export default GalleryRoutes;
