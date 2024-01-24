import {body} from 'express-validator';

export const loginValidation = [
    body('email', 'email is invalid format').isEmail(),
    body('password', 'password length must bin min 5 characters long').isLength({min: 5}),
];

export const registerValidation = [
    body('email', 'email is invalid format').isEmail(),
    body('password', 'password length must bin min 5 characters long').isLength({min: 5}),
    body('fullName', 'fullname length must bin min 3 characters long').isLength({min: 3}),
    body('avatarUrl', 'url by avatar is invalid').optional().isURL()
];

export const postCreateValidation = [
    body('title', 'title min 3').isLength({min: 3}).isString(),
    body('text', 'text min 3').isLength({min: 3}).isString(),
    body('tags', 'must be array').optional().isArray(),
    body('imageUrl', 'url by image is invalid').optional().isString()
]
