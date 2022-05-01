import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '..', '.env') });
import express from 'express';
const morgan = require('morgan');
import userRouter from './routes/user';
import { connect } from './lib/mongodb/mongoose';

const app = express();
let port = process.env.PORT || 8080;

app.use(morgan('combined'));
app.use(express.json());
app.use('/user', userRouter);

connect().then(() => {
    app.listen(port, () => {
        console.log(`Server is listening on ${port}`);
    });
})
.catch((err) => {
    console.log(err);
});

export default app;