import express from 'express';
import mongoose from 'mongoose';
import { postSchema } from '../models/post';
import { requireLogin } from '../middlewares/requireLogin';

const postRouter = express.Router();

const Post = mongoose.model('Post', postSchema);

postRouter.get('/', requireLogin, (req, res) => {
    Post.find()
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .then(posts => {
            console.log('----', posts)
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })
})

postRouter.get('/myPost', requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .then(myPost => {
            res.json({ myPost })
        })
        .catch(err => { console.log(err) })
})

postRouter.post('/createPost', requireLogin, (req, res) => {
    const { title, body, pic } = req.body;
    if (!title || !body || !pic) {
        res.status(422).json({ error: "Please provide all fields" })
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo: pic,
        postedBy: req.user
    })
    post.save().then(result => {
        res.send({ post: result })
    }).catch(err => {
        console.log(err)
    })
})

postRouter.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    }).populate("comments.postedBy", "_id name").exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        return res.json(result);
    })
})

postRouter.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    }).populate("comments.postedBy", "_id name").exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        return res.json(result);
    })
})

postRouter.put('/comments', requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true
    }).populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            return res.json(result);
        })
})

postRouter.delete('/delete/:postId', requireLogin, (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({ error: err })
            }
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                post.remove()
                    .then(result => res.json(result))
                    .catch(err => console.log(err))
            }
        })
})

postRouter.delete('/delete/:commentId', requireLogin, (req, res) => {
    Post.findOne({ _id: req.params.commentId })
        .populate("postedBy", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({ error: err })
            }
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                post.remove()
                    .then(result => res.json(result))
                    .catch(err => console.log(err))
            }
        })
})

export default postRouter;