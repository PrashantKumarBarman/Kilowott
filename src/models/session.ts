import { Schema, model, Types } from "mongoose";
import { IUser } from './user';

interface ISession {
    _id?: Types.ObjectId|undefined;
    access_key: string;
    user: Types.ObjectId|undefined;
    expires_in: Date;
    status?: 'active' | 'inactive';
};

interface PopulatedUser {
    user: IUser;
}

const sessionSchema = new Schema({
    access_key: { type: String, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    expires_in: { type: Date },
    status: { type: String, default: 'active', enum: ['active', 'inactive'] }
},
{ timestamps: true });

const Session = model<ISession>('Session', sessionSchema);

export default {
    add: async function(session: ISession) : Promise<ISession> {
        try {
            let sessionDocument = new Session(session);
            await sessionDocument.save();
            return sessionDocument;
        }
        catch(err: any) {
            console.log(err);
            throw new Error(err);
        }
    },
    findById: async function(id: string) {
        try {
            return await Session.findOne({ access_key: id, status: 'active' }).populate<Pick<PopulatedUser, 'user'>>('user', { role: 1 }).exec();
        }
        catch(err) {
            return null;
        }
    },
    deleteByUserId: async function(userId: string) {
        try {
            await Session.deleteOne({ user: new Types.ObjectId(userId) });
            return true;
        }
        catch(err: any) {
            console.log(err);
            throw new Error(err);
        }
    },
    disableByUserId: async function(userId: string) {
        try {
            await Session.updateOne({ user: new Types.ObjectId(userId) }, { status: 'inactive' });
            return true;
        }
        catch(err: any) {
            console.log(err);
            throw new Error(err);
        }
    }
};

