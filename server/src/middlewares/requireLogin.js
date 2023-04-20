import jwt from "jsonwebtoken";
import mongoose from 'mongoose';
import { JWT_SECRET } from "../keys";
import { userSchema } from '../models/user';

const User = mongoose.model('User', userSchema)

export const requireLogin = (req, res, next) => {
    console.log('aaaaaaaaaaaaa');
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: "Please provide token" })
    }
    const token = authorization.replace('Bearer ', '')
    jwt.verify(token, JWT_SECRET, (err, payload) => {

        if (err) {
            return res.status(401).json({ error: "Please login first" })
        }
        else {
            const { _id } = payload;
            User.findById(_id).then(userData => {
                console.log('useData', userData)
                req.user = userData;
                next();
            })
        }
    })
}

