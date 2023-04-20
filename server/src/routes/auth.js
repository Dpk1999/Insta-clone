import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { userSchema } from '../models/user';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../keys';
import { requireLogin } from '../middlewares/requireLogin';

const authRouter = express.Router();

const User = mongoose.model('User', userSchema)

authRouter.get('/', (req, res) => {
    res.send('Hello World')
})

authRouter.get('/protected', requireLogin, (req, res) => {
    User.find()
        .then(users => {
            res.json({ users })
        })
        .catch(err => console.log(err))
})

authRouter.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    if (!name, !email, !password) {
        res.status(422).json({ error: "Please add all required fields" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                res.status(422).json({ error: "User already exists" })
            }
            else {
                bcrypt.hash(password, 12).then(hashedpassword => {
                    const user = new User({
                        name,
                        email,
                        password: hashedpassword
                    })
                    user.save()
                        .then((user) => {
                            res.json({ message: 'User Created Succesfully' })
                        })
                        .catch((err) => console.log(err))
                })
            }
        }).catch(err => console.log(err))
})

authRouter.post('/signin', (req, res) => {
    const { email, password } = req.body;
    console.log('req.body', req.body)
    if (!email || !password) {
        return res.status(422).json({ error: "Please enter email and password" })
    }
    User.findOne({ email: email })
        .then(savedData => {
            if (!savedData) {
                return res.status(422).json({ error: "Invalid email or password" })
            }
            bcrypt.compare(password, savedData.password)
                .then(passMatch => {
                    if (passMatch) {
                        const token = jwt.sign({ _id: savedData._id }, JWT_SECRET)
                        const { _id, name, email } = savedData;
                        res.json({ token, user: { _id, name, email } });
                    } else {
                        return res.status(422).json({ error: "Invalid email or password" })
                    }
                }).catch(err => console.log('errrrr', err))
        })
})

export default authRouter;