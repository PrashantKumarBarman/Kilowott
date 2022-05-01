import express from 'express';
import userController from '../controllers/user';
import { loginValidator, addUserValidator, updateUserValidator } from '../controllers/validators/user';
import { sessionMiddleware } from '../controllers/middlewares';

const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: '/uploads' });

router.post('/login', loginValidator(), userController.login);

router.use(sessionMiddleware);

router.get('/', userController.getAllUsers);

router.post('/', addUserValidator(), userController.addUser);

router.put('/password', userController.updateUserPassword);

router.put('/profilepic', upload.single('profile_pic'), userController.updateProfilePic);

router.put('/', updateUserValidator(), userController.updateUser);

router.put('/:id/status/inactive', userController.disableUser);

router.delete('/:id', userController.deleteUser);

export default router;