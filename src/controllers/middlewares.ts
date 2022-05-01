import { Request, Response, NextFunction } from 'express';
import sessionModel from '../models/session';

async function sessionMiddleware(req: Request, res: Response, next: NextFunction ) {
    let authHeader = req.headers['authorization'];
    let accessKey = authHeader?.split(' ')[1];
    if(!accessKey) return res.status(401).send('No access key provided');
    
    let session = await sessionModel.findById(accessKey);

    if(!session) return res.status(401).send('Unauthorized, no user found');

    req.session = { accessKey: accessKey, expiresIn: session.expires_in, user: { id: session.user?._id, role: session.user.role } };
    next();
}

export { sessionMiddleware };