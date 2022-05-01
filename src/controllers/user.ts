import { Request, Response } from 'express';
import userModel from '../models/user';
import sessionModel from '../models/session';
import { createHash } from '../lib/encryption';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import { sendMail } from '../lib/email';
import fs from 'fs/promises';
import path from 'path';
const uid = require('uid-safe');

interface IAddUserRequest {
    first_name: string;
    last_name: string;
    email: string;
}

interface IAddUser extends IAddUserRequest {
    password: string;
}

interface ILoginRequest {
    email: string;
    password: string;
}

export default {
    addUser: async function(req: Request, res: Response) {
        try {
            if(req.session.user.role !== 'admin') {
                return res.sendStatus(401);
            }
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            let password = crypto.randomBytes(16).toString('hex');
            let userData : IAddUser = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: password
            }
            let result = await userModel.add(userData);
            if(result.error === 'DUPLICATED_EMAIL') {
                res.status(400).send('User with the same email already exists');
            }
            else {
                res.status(200).json({ id: result.result?._id });
                // Sending auto generated password through email
                let content = `
                <h1>Signup confimation</h1>
                Hi ${userData.first_name} ${userData.last_name} your account has been created succssfully, your can you below password to login with you email id ${userData.email} <br>
                ${password}`;
                sendMail(userData.email, content, 'html', 'Signup');
            }
        }
        catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    },
    login: async function(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            let loginDetails : ILoginRequest = req.body as ILoginRequest;
            let user = await userModel.findByEmail(loginDetails.email);
            if(!user) {
                return res.status(400).send(`User doesn't exists`);
            }
            // comparing password hash
            if(createHash(loginDetails.password) === user?.password) {
                let expiresIn = new Date();
                // sessions last for 30 days
                expiresIn.setDate(expiresIn.getDate() + 30);
                let accessKey = await uid(24);
                await sessionModel.add({ access_key: accessKey, user: user._id, expires_in: expiresIn });
                res.status(200).json({ user_id: user._id, access_key: accessKey, expires_in: expiresIn });
            }
            else {
                res.status(401).send('Invalid credentials');
            }
        }
        catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    },
    getAllUsers: async function(req: Request, res: Response) {
        try {
            if(req.session.user.role !== 'admin') {
                return res.sendStatus(401);
            }
            let users = await userModel.findAllNonAdmins({ __v: 0, password: 0 });
            res.status(200).json(users);
        }
        catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    },
    deleteUser: async function(req: Request, res: Response) {
        try {
            if(req.session.user.role !== 'admin') {
                return res.sendStatus(401);
            }
            await userModel.deleteById(req.params.id);
            res.sendStatus(200);
        }
        catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    },
    disableUser: async function(req: Request, res: Response) {
        try {
            if(req.session.user.role !== 'admin') {
                return res.sendStatus(401);
            }
            await userModel.disableById(req.params.id);
            res.sendStatus(200);
        }
        catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    },
    updateUser: async function(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            let updateObj: any = {};
            if(req.body.first_name) {
                updateObj['first_name'] = req.body.first_name;
            }
            if(req.body.last_name) {
                updateObj['last_name'] = req.body.last_name;
            }
            if(req.body.address) {
                if(req.body.address.home) {
                    updateObj['address.home'] = req.body.address.home;
                }
                if(req.body.address.work) {
                    updateObj['address.work'] = req.body.address.work;
                }
            }
            await userModel.updateById(updateObj, req.session.user.id?.toString() as any);
            res.sendStatus(200);
        }
        catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    },
    updateUserPassword: async function(req: Request, res: Response) {
        try {
            if(!req.body.password || (typeof req.body.password !== 'string')) {
                return res.status(400).send('No password provided');
            }
            if(req.body.password.length < 5 || req.body.password.length > 32) {
                return res.status(400).send('Passsword has to be of minimum 5 and maximum 32 letters');
            }
            await userModel.updatePassword(req.session.user.id as any, req.body.password);
            res.sendStatus(200);
        }
        catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    },
    updateProfilePic: async function(req: any, res: Response) {
        try {
            if(!req.file) {
                return res.status(400).send('No file provided');
            }
            // Allowing only jpeg and png file types
            let allowedFileTypes = ['png', 'jpg', 'jpeg'];
            let fileType = req.file.mimetype.split('/')[1];
            if(!allowedFileTypes.includes(fileType)) {
                return res.status(400).send('Only JPEG and PNG file types are allowed');
            }
            // Allowing only files upto 2 mb max
            if(req.file.size > 2097152) {
                return res.status(400).send('Only files upto 2mb are allowed');
            }
            let basePath = path.join(__dirname, '..', '..', 'media', 'profilepic');
            let newFileName = `${req.session.user.id}.${fileType}`;
            await fs.rename(req.file.path, path.join(basePath, newFileName));
            let result = await userModel.updateProfilePic(req.session.user.id, newFileName);
            // Deleting old profile pic if there is one
            if(result?.profile_pic) {
                console.log(result);
                await fs.unlink(path.join(basePath, result.profile_pic));
            }
            res.sendStatus(200);
        }
        catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
}