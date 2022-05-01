import { Request } from "express";
import { Types } from 'mongoose';

interface User {
    id: Types.ObjectId | undefined;
    role: string | undefined;
}
declare global {
    namespace Express {
        export interface Session {
            accessKey: string;
            expiresIn: Date;
            user: User;
        }
        export interface Request {
            session: Session;
        }
    }
}