import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./src/Auth.js";
import userRoutes from "./src/routes/User.js";
import LecturerRoutes from "./src/routes/Lecturers.js";
import LectureNotesRoutes from "./src/routes/LectureNotes.js";
import GalleryRoutes from "./src/routes/Gallery.js";

const app = express();
const port = process.env.PORT;
const db = mongoose.connection

mongoose.connect(process.env.DATABASE_URL, {
    dbName: `Ahiajoku`,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json());
app.use(cors());

app.use('/login', authRoutes);
app.use('/user', userRoutes);
app.use('/lecturers', LecturerRoutes);
app.use('/lecture_notes', LectureNotesRoutes);
app.use('/gallery', GalleryRoutes)

app.get('/', (req, res) => res.send('Please choose a specific route...'));

app.listen(port, () => {
    console.log(`Server Running on port:${port}`)
})
