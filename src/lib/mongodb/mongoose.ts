import mongoose from "mongoose";

async function connect() {
    try {
        await mongoose.connect(`mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}?authSource=admin`);
        console.log('Connected to Mongodb');
    }
    catch(err: any) {
        console.log(err);
        throw new Error(err);
    }
};

export default mongoose;

export { connect };