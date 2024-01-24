import PostModel from '../models/Post.js';
import post from "../models/Post.js";

export const getAll = async (req, res) => {
    try{
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts);
    }catch (err){
        console.log(err);
        res.status(500).json({
            message: ' failed to retrieve articles'
        })
    }
};

export const getOne = (req, res) => {
    try {
        const postId = req.params.id

        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                returnDocument: 'after',
            },
        ).then((post) => {
            if (!post) {
                return res.status(404).json({
                    message: 'статьтя не найдена',
                })
            }

            res.json(post)
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'не удалось получить статью',
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        });

        const post = await doc.save();

        res.json(post);

    }catch (err){
        console.log(err);
        res.status(500).json({
            message: ' failed to create post'
        })
    }
};

export const remove = async (req, res) => {
    try{
        const postId = req.params.id;

        PostModel.findOneAndDelete({
            _id: postId
        }).then(
            (doc) => {

                if(!doc){
                    return res.status(404).json({
                        message: 'post not found',
                    })
                }

                res.json({
                    success: true
                })
            }
        ).catch(
            (err) => {
                if(err){
                    console.log(err);
                    res.status(500).json({
                        message: ' failed to remove post'
                    })
                }
            }
        )
    }catch (err){
        console.log(err);
        res.status(500).json({
            message: ' failed to remove post'
        })
    }
};

export const update = async (req, res) => {
    try{
        const postId = req.params.id;

        await PostModel.updateOne({
            _id: postId
        },{
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId
            }
            ).then((post) => {

            if(!post){
                return res.status(404).json({
                    message: 'post not found',
                })
            }
                res.json({
                    success: true
                })
        });

    }catch (err){
        console.log(err);
        res.status(500).json({
            message: ' failed to update post'
        })
    }
}

