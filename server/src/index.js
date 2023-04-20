import express from 'express';
import mongoose from 'mongoose';
import { authRouter, postRouter, userRouter } from './routes/index';
import { MONGO_URL, PORT } from './keys'

const app = express();

app.get('/Health-check', (req, res) => {
    res.send("I'm fine")
});

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to mongoDB')
    }).catch((err) => {
        console.log('error in connection', err)
    })

app.use(express.json())
app.use(postRouter);
app.use(authRouter);
app.use(userRouter);

app.listen(PORT, () => {
    console.log('app is running on port', PORT)
})
