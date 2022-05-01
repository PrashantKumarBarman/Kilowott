import { body } from 'express-validator';

function loginValidator() {
    return [
        body('email').isEmail().isLength({ max: 100 }),
        body('password').isLength({ min: 5, max: 32 })
    ];
}

function addUserValidator() {
    return [
        body('email').isEmail().isLength({ min: 5, max: 100 }),
        body('first_name').isLength({ min: 1, max: 100 }),
        body('last_name').isLength({ min: 1, max: 100 })
    ];
}

function updateUserValidator() {
    return [
        body('first_name').isLength({ min: 1, max: 100 }).optional(),
        body('last_name').isLength({ min: 1, max: 100 }).optional(),
        body('address.home').isLength({ min: 1, max: 1000 }).optional(),
        body('address.work').isLength({ min: 1, max: 1000 }).optional()
    ];
}

export { loginValidator, addUserValidator, updateUserValidator };