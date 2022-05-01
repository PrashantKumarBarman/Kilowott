import { Schema, model, Types } from "mongoose";
import { createHash } from '../lib/encryption';
import sessionModel from './session';

export interface IUser {
    _id?: Types.ObjectId|undefined;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    address?: {
        home: string,
        work: string
    };
    profile_pic?: string;
    role?: 'admin' | 'user';
    status?: 'active' | 'inactive';
};

const userSchema = new Schema<IUser>({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true },
    address: {
        home: String,
        work: String
    },
    profile_pic: String,
    role: { type: String, default: 'user', enum: ['admin', 'user'] },
    status: { type: String, default: 'active', enum: ['active', 'inactive'] }
},
{ timestamps: true });

const User = model<IUser>('User', userSchema);

export default {
    add: async function(user: IUser) : Promise<{ error: 'DUPLICATED_EMAIL'|null, result: IUser|null}> {
        try {
            user.password = createHash(user.password);
            let userDocument = new User(user);
            await userDocument.save();
            return { error: null, result: userDocument };
        }
        catch(err: any) {
            console.log(err);
            // Error code 11000 is for duplicate record in Mongodb
            if(err.code === 11000) {
                return { error: 'DUPLICATED_EMAIL', result: null };
            } 
            throw new Error(err);
        }
    },
    findByEmail: async function(email: string, projection: object|null = null) : Promise<IUser|null> {
        try {
            if(projection) {
                return await User.findOne({ email: email, status: 'active' }).select(projection).exec();
            }
            else {
                return await User.findOne({ email: email, status: 'active' }).exec();
            }
        }
        catch(err: any) {
            throw new Error(err);
        }
    },
    findById: async function(id: string, projection: object|null = null) : Promise<IUser|null> {
        try {
            if(projection) {
                return await User.findOne({ _id: new Types.ObjectId(id), status: 'active' }).select(projection).exec();
            }
            else {
                return await User.findOne({ _id: new Types.ObjectId(id), status: 'active' }).exec();
            }
        }
        catch(err: any) {
            throw new Error(err);
        }
    },
    findAll: async function(projection: object|null = null) {
        try {
            if(projection) {
                return await User.find({}).select(projection).exec();
            }
            else {
                return await User.find({}).exec();
            }
        }
        catch(err: any) {
            throw new Error(err);
        }
    },
    findAllNonAdmins: async function(projection: object|null = null) {
        try {
            if(projection) {
                return await User.find({ role: 'user' }).select(projection).exec();
            }
            else {
                return await User.find({ role: 'user' }).exec();
            }
        }
        catch(err: any) {
            throw new Error(err);
        }
    },
    deleteById: async function(id: string) {
        try {
            await User.deleteOne({ _id: new Types.ObjectId(id) }).exec();
            // Deleting sessions also for the user
            await sessionModel.deleteByUserId(id);
            return true;
        }
        catch(err: any) {
            console.log(err);
            throw new Error(err);
        }
    },
    disableById: async function(id: string) {
        try {
            await User.updateOne({ _id: new Types.ObjectId(id) }, { status: 'inactive' }).exec();
            // Disabling sessions also for the user
            await sessionModel.disableByUserId(id);
            return true;
        }
        catch(err: any) {
            console.log(err);
            throw new Error(err);
        }
    },
    updateById: async function(updateObj: any, id: string) {
        try {
            await User.updateOne({ _id: new Types.ObjectId(id) }, { "$set" : updateObj }).exec();
            return true;
        }
        catch(err: any) {
            console.log(err);
            throw new Error(err);
        }
    },
    updatePassword: async function(id: string, password: string) {
        try {
            await User.updateOne({ _id: new Types.ObjectId(id) }, { "$set" : { password: createHash(password) } }).exec();
            return true;
        }
        catch(err: any) {
            console.log(err);
            throw new Error(err);
        }
    },
    /**
     * Updates new profile picture name and returns the old one
     * @param id 
     * @param profilePic 
     * @returns 
     */
    updateProfilePic: async function(id: string, profilePic: string) {
        try {
            return await User.findOneAndUpdate({ _id: new Types.ObjectId(id) }, { profile_pic: profilePic }).select({ profile_pic: 1 }).exec();
        }
        catch(err: any) {
            console.log(err);
            throw new Error(err);
        }
    }
};

