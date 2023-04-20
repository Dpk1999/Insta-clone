import express from 'express';
import mongoose from 'mongoose';
import { userSchema } from '../models/user';
import { requireLogin } from '../middlewares/requireLogin';

const userRouter = express.Router();

const User = mongoose.model('User', userSchema);

userRouter.get('/user/:id', requireLogin, (req, res) => {
    console.log('---------->', User.findOne({ _id: req.params.id }))
    User.findOne({ _id: req.params.id })
        .select('-password')
        .then(user => {
            console.log('user-->', user)
            Post.find({ postedBy: req.params.id })
                .populate("postedBy", "_id, name")
                .exec((err, posts) => {
                    console.log('posts', posts)
                    if (err) {
                        console.log('-------inside errror')
                        return res.status(422).json({ error: err })
                    }
                    res.json({ user, posts })
                })
        }).catch(err => {
            console.log('-------inside errror11111111')

            res.status(404).json({ error: "User not found" })
        })
})

userRouter.put('follow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        User.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId },
        }, { new: true }).then((res) => {
            res.json(res)
        }).catch(err => {
            return res.status(422).json({ error: err })
        })

    })

})

userRouter.put('unfollow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.followId },
        }, { new: true }).then((res) => {
            res.json(res)
        }).catch(err => {
            return res.status(422).json({ error: err })
        })

    })

})

export default userRouter;