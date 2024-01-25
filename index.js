import express from "express";
import mongoose from "mongoose";
import multer from 'multer'; //for upload file
import {loginValidation, registerValidation, postCreateValidation} from "./validations.js";
import {checkAuth, handleValidationErrors} from './utils/index.js'
import {UserController, PostController} from "./controllers/index.js";


//connect DB
mongoose
    .connect('mongodb+srv://admin:123456qwerty@cluster0.jmsxdsc.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

//start server
const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));

//file store
const fileStorage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, './uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({storage: fileStorage});

//routes

app.get('/auth/me', checkAuth, UserController.getMe);
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    try {
        res.json({
            url: `/uploads/${req.file.originalname}`
        })
    }catch (err){

    }

})

app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, PostController.update);

app.listen(4444, (err) => {
    if(err){
        return console.log(err)
    }

    console.log("Server OK")
})