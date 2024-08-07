import express from 'express';
import { verifyToken } from '../Auth.js';
import mongoose from 'mongoose';
import { UserModel } from "../models/User.js";

const userRoutes = express.Router();

userRoutes.get('/', async (req, res) => {
        try {
            const result = await UserModel.find({});
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json(err);
        }
});

userRoutes.get("/:userid", verifyToken, async (req, res) => {
  try {
    const result = await UserModel.findById(req.params.userid);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

userRoutes.post("/", verifyToken, async (req, res) => {
  const user = new UserModel({
    _id: new mongoose.Types.ObjectId(),
    email: req.body.email,
    password: req.body.password,
  });
  try {
    const result = await user.save();
    res.status(201).json({
      new_user: {
        email: result.email,
        password: result.password,
        _id: result._id
      },
    });
  } catch (err) {
      res.status(500).json(err);
  }
});

userRoutes.put("/:userid", verifyToken, async(req, res) => {
  try {
      const user = req.params.userid;
      const updatedData = req.body;
      const options = { new: true };

      const result = await UserModel.findOneAndUpdate(
          { _id: user }, updatedData, options
      )
      res.status(200).json(result);
      console.log(result);
  }
  catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
  }
});

export default userRoutes;
