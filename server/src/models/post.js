import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types

export const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    likes: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
    comments: [{
        text: String,
        postedBy: [{ type: ObjectId, ref: 'User' }]
    }],
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }

})

mongoose.model('Post', postSchema)