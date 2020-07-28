const { check } = require('express-validator');

exports.userValidator = [
    check('name')
        .not()
        .isLength({ min: 3 })
        .isEmpty()
        .withMessage('Name is required'),

    check('email')
        .isEmail()
];
